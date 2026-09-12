from datetime import datetime
from typing import Any


def create_notification(
    notification_type: str,
    recipient: str,
    subject: str,
    message: str,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    notification = {
        "type": notification_type,
        "recipient": recipient,
        "subject": subject,
        "message": message,
        "data": data or {},
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }

    return notification


def send_email_notification(
    recipient: str,
    subject: str,
    message: str,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    notification = create_notification(
        notification_type="email",
        recipient=recipient,
        subject=subject,
        message=message,
        data=data,
    )

    notification["status"] = "queued"

    return notification


def send_reservation_notification(
    recipient: str,
    customer_name: str,
    reservation_id: int,
    status: str,
) -> dict[str, Any]:
    subject = "Hostivo Reservation Update"

    message = (
        f"Hello {customer_name},\n\n"
        f"Your reservation #{reservation_id} "
        f"is currently {status}.\n\n"
        "Thank you for choosing Hostivo."
    )

    return send_email_notification(
        recipient=recipient,
        subject=subject,
        message=message,
        data={
            "reservation_id": reservation_id,
            "status": status,
        },
    )


def send_payment_notification(
    recipient: str,
    customer_name: str,
    payment_id: str,
    amount: float,
    status: str,
) -> dict[str, Any]:
    subject = "Hostivo Payment Update"

    message = (
        f"Hello {customer_name},\n\n"
        f"Your payment {payment_id} "
        f"of KSh {amount:.2f} is {status}.\n\n"
        "Thank you for choosing Hostivo."
    )

    return send_email_notification(
        recipient=recipient,
        subject=subject,
        message=message,
        data={
            "payment_id": payment_id,
            "amount": amount,
            "status": status,
        },
    )


def send_order_notification(
    recipient: str,
    customer_name: str,
    order_id: int,
    status: str,
) -> dict[str, Any]:
    subject = "Hostivo Order Update"

    message = (
        f"Hello {customer_name},\n\n"
        f"Your order #{order_id} "
        f"is currently {status}.\n\n"
        "Thank you for choosing Hostivo."
    )

    return send_email_notification(
        recipient=recipient,
        subject=subject,
        message=message,
        data={
            "order_id": order_id,
            "status": status,
        },
    )