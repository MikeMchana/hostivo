from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import Customer, Reservation, Room, User
from app.schemas.reservation import ReservationCreate, ReservationResponse
from app.schemas.public_booking import (
    PublicBookingCreate,
    PublicBookingResponse,
)


router = APIRouter(
    prefix="/reservations",
    tags=["Reservations"],
)


# ============================================================
# RESERVATION RESPONSE HELPER
# ============================================================

def build_reservation_response(
    reservation: Reservation,
    db: Session,
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == reservation.customer_id)
        .first()
    )

    room = (
        db.query(Room)
        .filter(Room.id == reservation.room_id)
        .first()
    )

    return {
        "id": reservation.id,
        "customer_id": reservation.customer_id,
        "room_id": reservation.room_id,
        "check_in": reservation.check_in,
        "check_out": reservation.check_out,
        "guests": reservation.guests,
        "total_amount": float(reservation.total_amount),
        "status": reservation.status,
        "created_at": reservation.created_at,

        # Customer information
        "customer_name": customer.full_name if customer else None,
        "customer_email": customer.email if customer else None,
        "customer_phone": customer.phone if customer else None,

        # Room information
        "room_number": room.room_number if room else None,
        "room_type": room.room_type if room else None,
    }


# ============================================================
# PUBLIC BOOKING
# ============================================================

@router.post(
    "/public",
    response_model=PublicBookingResponse,
)
def create_public_booking(
    booking_data: PublicBookingCreate,
    db: Session = Depends(get_db),
):
    # Find customer by phone
    customer = (
        db.query(Customer)
        .filter(Customer.phone == booking_data.phone)
        .first()
    )

    # If not found by phone, try email
    if not customer and booking_data.email:
        customer = (
            db.query(Customer)
            .filter(Customer.email == booking_data.email)
            .first()
        )

    # Create customer if this is a new guest
    if not customer:
        customer = Customer(
            full_name=booking_data.full_name,
            phone=booking_data.phone,
            email=booking_data.email,
            status="active",
        )

        db.add(customer)
        db.flush()

    # Check that the room exists
    room = (
        db.query(Room)
        .filter(Room.id == booking_data.room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    # Validate dates
    if booking_data.check_out <= booking_data.check_in:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date",
        )

    # Check room availability
    if room.status != "available":
        raise HTTPException(
            status_code=400,
            detail="Room is not available",
        )

    # Check for overlapping reservations
    overlapping_reservation = (
        db.query(Reservation)
        .filter(
            Reservation.room_id == booking_data.room_id,
            Reservation.status.in_(
                ["pending", "confirmed", "checked_in"]
            ),
            Reservation.check_in < booking_data.check_out,
            Reservation.check_out > booking_data.check_in,
        )
        .first()
    )

    if overlapping_reservation:
        raise HTTPException(
            status_code=400,
            detail="Room is already reserved for the selected dates",
        )

    # Create reservation
    reservation = Reservation(
        customer_id=customer.id,
        room_id=booking_data.room_id,
        check_in=booking_data.check_in,
        check_out=booking_data.check_out,
        guests=booking_data.guests,
        total_amount=booking_data.total_amount,
        status="pending",
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return reservation


# ============================================================
# ADMIN RESERVATION CREATION
# ============================================================

@router.post("/", response_model=ReservationResponse)
def create_reservation(
    reservation_data: ReservationCreate,
    db: Session = Depends(get_db),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == reservation_data.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    room = (
        db.query(Room)
        .filter(Room.id == reservation_data.room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    if reservation_data.check_out <= reservation_data.check_in:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date",
        )

    if room.status != "available":
        raise HTTPException(
            status_code=400,
            detail="Room is not available",
        )

    overlapping_reservation = (
        db.query(Reservation)
        .filter(
            Reservation.room_id == reservation_data.room_id,
            Reservation.status.in_(
                ["pending", "confirmed", "checked_in"]
            ),
            Reservation.check_in < reservation_data.check_out,
            Reservation.check_out > reservation_data.check_in,
        )
        .first()
    )

    if overlapping_reservation:
        raise HTTPException(
            status_code=400,
            detail="Room is already reserved for the selected dates",
        )

    reservation = Reservation(
        customer_id=reservation_data.customer_id,
        room_id=reservation_data.room_id,
        check_in=reservation_data.check_in,
        check_out=reservation_data.check_out,
        guests=reservation_data.guests,
        total_amount=reservation_data.total_amount,
        status=reservation_data.status,
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return build_reservation_response(reservation, db)


# ============================================================
# GET ALL RESERVATIONS
# ============================================================

@router.get("/", response_model=list[ReservationResponse])
def get_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservations = (
        db.query(Reservation)
        .order_by(Reservation.created_at.desc())
        .all()
    )

    return [
        build_reservation_response(reservation, db)
        for reservation in reservations
    ]


# ============================================================
# GET SINGLE RESERVATION
# ============================================================

@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    return build_reservation_response(reservation, db)


# ============================================================
# CONFIRM RESERVATION
# ============================================================

@router.patch(
    "/{reservation_id}/confirm",
    response_model=ReservationResponse,
)
def confirm_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    if reservation.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending reservations can be confirmed",
        )

    reservation.status = "confirmed"

    db.commit()
    db.refresh(reservation)

    return build_reservation_response(reservation, db)


# ============================================================
# CHECK IN
# ============================================================

@router.patch(
    "/{reservation_id}/check-in",
    response_model=ReservationResponse,
)
def check_in_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    if reservation.status != "confirmed":
        raise HTTPException(
            status_code=400,
            detail="Only confirmed reservations can be checked in",
        )

    room = (
        db.query(Room)
        .filter(Room.id == reservation.room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    if room.status != "available":
        raise HTTPException(
            status_code=400,
            detail="Room is not available for check-in",
        )

    reservation.status = "checked_in"
    room.status = "occupied"

    db.commit()
    db.refresh(reservation)

    return build_reservation_response(reservation, db)


# ============================================================
# CHECK OUT
# ============================================================

@router.patch(
    "/{reservation_id}/check-out",
    response_model=ReservationResponse,
)
def check_out_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    if reservation.status != "checked_in":
        raise HTTPException(
            status_code=400,
            detail="Only checked-in reservations can be checked out",
        )

    room = (
        db.query(Room)
        .filter(Room.id == reservation.room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    reservation.status = "checked_out"
    room.status = "cleaning"

    db.commit()
    db.refresh(reservation)

    return build_reservation_response(reservation, db)


# ============================================================
# CANCEL RESERVATION
# ============================================================

@router.patch(
    "/{reservation_id}/cancel",
    response_model=ReservationResponse,
)
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    if reservation.status in ["checked_out", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Reservation cannot be cancelled",
        )

    reservation.status = "cancelled"

    db.commit()
    db.refresh(reservation)

    return build_reservation_response(reservation, db)


# ============================================================
# DELETE RESERVATION
# ============================================================

@router.delete("/{reservation_id}")
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    db.delete(reservation)
    db.commit()

    return {
        "message": "Reservation deleted successfully",
    }