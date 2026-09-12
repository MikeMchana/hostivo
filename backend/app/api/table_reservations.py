from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import (
    Customer,
    RestaurantTable,
    RestaurantTableReservation,
    User,
)
from app.schemas.table_reservation import (
    PublicTableReservationCreate,
    TableReservationResponse,
)


router = APIRouter(
    prefix="/table-reservations",
    tags=["Table Reservations"],
)


# ============================================================
# PUBLIC TABLE RESERVATION
# ============================================================

@router.post(
    "/public",
    response_model=TableReservationResponse,
)
def create_public_table_reservation(
    reservation_data: PublicTableReservationCreate,
    db: Session = Depends(get_db),
):
    # --------------------------------------------------------
    # Validate guests
    # --------------------------------------------------------

    if reservation_data.guests < 1:
        raise HTTPException(
            status_code=400,
            detail="Number of guests must be at least 1",
        )

    # --------------------------------------------------------
    # Find or create customer
    # --------------------------------------------------------

    customer = (
        db.query(Customer)
        .filter(Customer.phone == reservation_data.phone)
        .first()
    )

    if customer:
        customer.full_name = reservation_data.full_name

        if reservation_data.email:
            customer.email = reservation_data.email
    else:
        customer = Customer(
            full_name=reservation_data.full_name,
            phone=reservation_data.phone,
            email=reservation_data.email,
            status="active",
        )

        db.add(customer)
        db.flush()

    # --------------------------------------------------------
    # Find suitable available table
    # --------------------------------------------------------

    tables = (
        db.query(RestaurantTable)
        .filter(
            RestaurantTable.status == "available",
            RestaurantTable.capacity >= reservation_data.guests,
        )
        .order_by(RestaurantTable.capacity.asc())
        .all()
    )

    if not tables:
        raise HTTPException(
            status_code=400,
            detail="No suitable table is currently available for the requested number of guests.",
        )

    # --------------------------------------------------------
    # Find a table that is not already booked
    # for the requested date and time
    # --------------------------------------------------------

    selected_table = None

    for table in tables:
        existing_reservation = (
            db.query(RestaurantTableReservation)
            .filter(
                RestaurantTableReservation.table_id == table.id,
                RestaurantTableReservation.reservation_date
                == reservation_data.reservation_date,
                RestaurantTableReservation.reservation_time
                == reservation_data.reservation_time,
                RestaurantTableReservation.status.in_(
                    ["pending", "confirmed"]
                ),
            )
            .first()
        )

        if not existing_reservation:
            selected_table = table
            break

    if not selected_table:
        raise HTTPException(
            status_code=400,
            detail="All suitable tables are already reserved for the selected date and time.",
        )

    # --------------------------------------------------------
    # Create reservation
    # --------------------------------------------------------

    reservation = RestaurantTableReservation(
        customer_id=customer.id,
        table_id=selected_table.id,
        reservation_date=reservation_data.reservation_date,
        reservation_time=reservation_data.reservation_time,
        guests=reservation_data.guests,
        special_requests=reservation_data.special_requests,
        status="pending",
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    # --------------------------------------------------------
    # Build response
    # --------------------------------------------------------

    return TableReservationResponse(
        id=reservation.id,
        customer_id=customer.id,
        table_id=selected_table.id,
        reservation_date=reservation.reservation_date,
        reservation_time=reservation.reservation_time,
        guests=reservation.guests,
        special_requests=reservation.special_requests,
        status=reservation.status,
        created_at=reservation.created_at,
        customer_name=customer.full_name,
        customer_email=customer.email,
        customer_phone=customer.phone,
        table_number=selected_table.table_number,
        table_section=selected_table.section,
    )


# ============================================================
# ADMIN - GET ALL TABLE RESERVATIONS
# ============================================================

@router.get(
    "/",
    response_model=list[TableReservationResponse],
)
def get_table_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservations = (
        db.query(RestaurantTableReservation)
        .order_by(
            RestaurantTableReservation.reservation_date.asc(),
            RestaurantTableReservation.reservation_time.asc(),
        )
        .all()
    )

    results = []

    for reservation in reservations:
        customer = (
            db.query(Customer)
            .filter(Customer.id == reservation.customer_id)
            .first()
        )

        table = (
            db.query(RestaurantTable)
            .filter(RestaurantTable.id == reservation.table_id)
            .first()
        )

        results.append(
            TableReservationResponse(
                id=reservation.id,
                customer_id=reservation.customer_id,
                table_id=reservation.table_id,
                reservation_date=reservation.reservation_date,
                reservation_time=reservation.reservation_time,
                guests=reservation.guests,
                special_requests=reservation.special_requests,
                status=reservation.status,
                created_at=reservation.created_at,
                customer_name=(
                    customer.full_name
                    if customer
                    else None
                ),
                customer_email=(
                    customer.email
                    if customer
                    else None
                ),
                customer_phone=(
                    customer.phone
                    if customer
                    else None
                ),
                table_number=(
                    table.table_number
                    if table
                    else None
                ),
                table_section=(
                    table.section
                    if table
                    else None
                ),
            )
        )

    return results


# ============================================================
# ADMIN - GET SINGLE TABLE RESERVATION
# ============================================================

@router.get(
    "/{reservation_id}",
    response_model=TableReservationResponse,
)
def get_table_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(RestaurantTableReservation)
        .filter(
            RestaurantTableReservation.id == reservation_id
        )
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Table reservation not found",
        )

    customer = (
        db.query(Customer)
        .filter(Customer.id == reservation.customer_id)
        .first()
    )

    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == reservation.table_id)
        .first()
    )

    return TableReservationResponse(
        id=reservation.id,
        customer_id=reservation.customer_id,
        table_id=reservation.table_id,
        reservation_date=reservation.reservation_date,
        reservation_time=reservation.reservation_time,
        guests=reservation.guests,
        special_requests=reservation.special_requests,
        status=reservation.status,
        created_at=reservation.created_at,
        customer_name=(
            customer.full_name
            if customer
            else None
        ),
        customer_email=(
            customer.email
            if customer
            else None
        ),
        customer_phone=(
            customer.phone
            if customer
            else None
        ),
        table_number=(
            table.table_number
            if table
            else None
        ),
        table_section=(
            table.section
            if table
            else None
        ),
    )


# ============================================================
# ADMIN - CONFIRM RESERVATION
# ============================================================

@router.patch(
    "/{reservation_id}/confirm",
    response_model=TableReservationResponse,
)
def confirm_table_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(RestaurantTableReservation)
        .filter(
            RestaurantTableReservation.id == reservation_id
        )
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Table reservation not found",
        )

    if reservation.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending reservations can be confirmed",
        )

    reservation.status = "confirmed"

    db.commit()
    db.refresh(reservation)

    customer = (
        db.query(Customer)
        .filter(Customer.id == reservation.customer_id)
        .first()
    )

    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == reservation.table_id)
        .first()
    )

    return TableReservationResponse(
        id=reservation.id,
        customer_id=reservation.customer_id,
        table_id=reservation.table_id,
        reservation_date=reservation.reservation_date,
        reservation_time=reservation.reservation_time,
        guests=reservation.guests,
        special_requests=reservation.special_requests,
        status=reservation.status,
        created_at=reservation.created_at,
        customer_name=customer.full_name if customer else None,
        customer_email=customer.email if customer else None,
        customer_phone=customer.phone if customer else None,
        table_number=table.table_number if table else None,
        table_section=table.section if table else None,
    )


# ============================================================
# ADMIN - CANCEL RESERVATION
# ============================================================

@router.patch(
    "/{reservation_id}/cancel",
    response_model=TableReservationResponse,
)
def cancel_table_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(RestaurantTableReservation)
        .filter(
            RestaurantTableReservation.id == reservation_id
        )
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Table reservation not found",
        )

    if reservation.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Reservation is already cancelled",
        )

    reservation.status = "cancelled"

    db.commit()
    db.refresh(reservation)

    customer = (
        db.query(Customer)
        .filter(Customer.id == reservation.customer_id)
        .first()
    )

    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == reservation.table_id)
        .first()
    )

    return TableReservationResponse(
        id=reservation.id,
        customer_id=reservation.customer_id,
        table_id=reservation.table_id,
        reservation_date=reservation.reservation_date,
        reservation_time=reservation.reservation_time,
        guests=reservation.guests,
        special_requests=reservation.special_requests,
        status=reservation.status,
        created_at=reservation.created_at,
        customer_name=customer.full_name if customer else None,
        customer_email=customer.email if customer else None,
        customer_phone=customer.phone if customer else None,
        table_number=table.table_number if table else None,
        table_section=table.section if table else None,
    )