from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import Customer, Order, Payment, Reservation, User
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services.mpesa import initiate_stk_push
from app.services.notifications import send_payment_notification


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


class MpesaSTKPushRequest(BaseModel):
    payment_id: str = Field(
        min_length=1,
        max_length=20,
    )

    phone_number: str = Field(
        min_length=10,
        max_length=15,
    )

    amount: float = Field(
        gt=0,
    )

    account_reference: str = Field(
        min_length=1,
        max_length=50,
    )

    transaction_description: str = Field(
        min_length=1,
        max_length=255,
    )

    customer_id: int | None = None

    reservation_id: int | None = None

    order_id: int | None = None


class MpesaCallbackRequest(BaseModel):
    Body: dict


def queue_payment_notification(
    db: Session,
    payment: Payment,
) -> dict | None:
    if payment.customer_id is None:
        return None

    customer = (
        db.query(Customer)
        .filter(
            Customer.id == payment.customer_id
        )
        .first()
    )

    if not customer:
        return None

    recipient = getattr(
        customer,
        "email",
        None,
    )

    if not recipient:
        return None

    customer_name = getattr(
        customer,
        "name",
        "Customer",
    )

    return send_payment_notification(
        recipient=recipient,
        customer_name=customer_name,
        payment_id=payment.payment_id,
        amount=float(payment.amount),
        status=payment.status,
    )


@router.post(
    "/mpesa/stk-push",
)
def mpesa_stk_push(
    payment_data: MpesaSTKPushRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id
            == payment_data.payment_id
        )
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="Payment ID already exists",
        )

    if (
        payment_data.customer_id is None
        and payment_data.reservation_id is None
        and payment_data.order_id is None
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Payment must be linked to a customer, "
                "reservation, or order"
            ),
        )

    if payment_data.customer_id is not None:
        customer = (
            db.query(Customer)
            .filter(
                Customer.id
                == payment_data.customer_id
            )
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found",
            )

    if payment_data.reservation_id is not None:
        reservation = (
            db.query(Reservation)
            .filter(
                Reservation.id
                == payment_data.reservation_id
            )
            .first()
        )

        if not reservation:
            raise HTTPException(
                status_code=404,
                detail="Reservation not found",
            )

    if payment_data.order_id is not None:
        order = (
            db.query(Order)
            .filter(
                Order.id
                == payment_data.order_id
            )
            .first()
        )

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

    pending_payment = Payment(
        payment_id=payment_data.payment_id,
        customer_id=payment_data.customer_id,
        reservation_id=payment_data.reservation_id,
        order_id=payment_data.order_id,
        amount=payment_data.amount,
        payment_method="mpesa",
        transaction_reference=None,
        status="pending",
    )

    db.add(pending_payment)
    db.commit()
    db.refresh(pending_payment)

    try:
        response = initiate_stk_push(
            phone_number=payment_data.phone_number,
            amount=payment_data.amount,
            account_reference=payment_data.payment_id,
            transaction_description=(
                payment_data.transaction_description
            ),
        )

        return {
            "message": (
                "M-Pesa STK Push initiated successfully"
            ),
            "payment_id": pending_payment.payment_id,
            "payment_database_id": pending_payment.id,
            "status": pending_payment.status,
            "data": response,
        }

    except Exception as error:
        db.delete(pending_payment)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.post(
    "/mpesa/callback",
)
def mpesa_callback(
    callback_data: MpesaCallbackRequest,
    db: Session = Depends(get_db),
):
    body = callback_data.Body

    stk_callback = body.get(
        "stkCallback",
        {},
    )

    result_code = stk_callback.get(
        "ResultCode"
    )

    result_description = stk_callback.get(
        "ResultDesc",
        "",
    )

    callback_metadata = (
        stk_callback.get(
            "CallbackMetadata",
            {},
        )
    )

    metadata_items = callback_metadata.get(
        "Item",
        [],
    )

    metadata = {}

    for item in metadata_items:
        name = item.get("Name")

        if name:
            metadata[name] = item.get("Value")

    account_reference = metadata.get(
        "AccountReference"
    )

    if not account_reference:
        account_reference = (
            stk_callback.get(
                "AccountReference"
            )
        )

    payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id
            == account_reference
        )
        .first()
    )

    if not payment:
        return {
            "ResultCode": result_code,
            "ResultDesc": result_description,
            "message": "Payment record not found",
        }

    if result_code == 0:
        receipt_number = metadata.get(
            "MpesaReceiptNumber"
        )

        payment.status = "completed"

        payment.transaction_reference = (
            receipt_number
        )

        db.commit()
        db.refresh(payment)

        notification = (
            queue_payment_notification(
                db,
                payment,
            )
        )

        return {
            "ResultCode": 0,
            "ResultDesc": (
                "Payment completed successfully"
            ),
            "payment_id": payment.payment_id,
            "status": payment.status,
            "transaction_reference": (
                payment.transaction_reference
            ),
            "notification": notification,
        }

    payment.status = "cancelled"

    db.commit()
    db.refresh(payment)

    notification = queue_payment_notification(
        db,
        payment,
    )

    return {
        "ResultCode": result_code,
        "ResultDesc": result_description,
        "payment_id": payment.payment_id,
        "status": payment.status,
        "notification": notification,
    }


@router.post(
    "/",
    response_model=PaymentResponse,
)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id
            == payment_data.payment_id
        )
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="Payment ID already exists",
        )

    if payment_data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Payment amount must be greater than zero"
            ),
        )

    if payment_data.customer_id is not None:
        customer = (
            db.query(Customer)
            .filter(
                Customer.id
                == payment_data.customer_id
            )
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found",
            )

    if payment_data.reservation_id is not None:
        reservation = (
            db.query(Reservation)
            .filter(
                Reservation.id
                == payment_data.reservation_id
            )
            .first()
        )

        if not reservation:
            raise HTTPException(
                status_code=404,
                detail="Reservation not found",
            )

    if payment_data.order_id is not None:
        order = (
            db.query(Order)
            .filter(
                Order.id
                == payment_data.order_id
            )
            .first()
        )

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

    if (
        payment_data.customer_id is None
        and payment_data.reservation_id is None
        and payment_data.order_id is None
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Payment must be linked to a customer, "
                "reservation, or order"
            ),
        )

    if payment_data.transaction_reference:
        existing_reference = (
            db.query(Payment)
            .filter(
                Payment.transaction_reference
                == payment_data.transaction_reference
            )
            .first()
        )

        if existing_reference:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Transaction reference already exists"
                ),
            )

    payment = Payment(
        payment_id=payment_data.payment_id,
        customer_id=payment_data.customer_id,
        reservation_id=payment_data.reservation_id,
        order_id=payment_data.order_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        transaction_reference=(
            payment_data.transaction_reference
        ),
        status=payment_data.status,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def get_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Payment).all()


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment


@router.patch(
    "/{payment_id}/complete",
    response_model=PaymentResponse,
)
def complete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    if payment.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Payment is already completed",
        )

    if payment.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail=(
                "Cancelled payments cannot be completed"
            ),
        )

    payment.status = "completed"

    db.commit()
    db.refresh(payment)

    notification = queue_payment_notification(
        db,
        payment,
    )

    return {
        **payment.__dict__,
        "notification": notification,
    }


@router.patch(
    "/{payment_id}/cancel",
    response_model=PaymentResponse,
)
def cancel_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    if payment.status == "completed":
        raise HTTPException(
            status_code=400,
            detail=(
                "Completed payments cannot be cancelled"
            ),
        )

    if payment.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Payment is already cancelled",
        )

    payment.status = "cancelled"

    db.commit()
    db.refresh(payment)

    notification = queue_payment_notification(
        db,
        payment,
    )

    return {
        **payment.__dict__,
        "notification": notification,
    }


@router.delete(
    "/{payment_id}"
)
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    db.delete(payment)
    db.commit()

    return {
        "message": "Payment deleted successfully",
    }