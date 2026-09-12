from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import Reservation, Room, User
from app.schemas.room import RoomCreate, RoomResponse, RoomUpdate


router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"],
)


@router.post("/", response_model=RoomResponse)
def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_room = (
        db.query(Room)
        .filter(Room.room_number == room_data.room_number)
        .first()
    )

    if existing_room:
        raise HTTPException(
            status_code=400,
            detail="Room number already exists",
        )

    room = Room(
        room_number=room_data.room_number,
        room_type=room_data.room_type,
        floor=room_data.floor,
        capacity=room_data.capacity,
        price_per_night=room_data.price_per_night,
        status=room_data.status,
    )

    db.add(room)
    db.commit()
    db.refresh(room)

    return room


@router.get("/", response_model=list[RoomResponse])
def get_rooms(
    db: Session = Depends(get_db),
):
    return db.query(Room).all()


@router.get("/{room_id}", response_model=RoomResponse)
def get_room(
    room_id: int,
    db: Session = Depends(get_db),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    return room


@router.patch("/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    room_data: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    existing_room = (
        db.query(Room)
        .filter(
            Room.room_number == room_data.room_number,
            Room.id != room_id,
        )
        .first()
    )

    if existing_room:
        raise HTTPException(
            status_code=400,
            detail="Room number already exists",
        )

    room.room_number = room_data.room_number
    room.room_type = room_data.room_type
    room.floor = room_data.floor
    room.capacity = room_data.capacity
    room.price_per_night = room_data.price_per_night

    db.commit()
    db.refresh(room)

    return room


@router.patch(
    "/{room_id}/available",
    response_model=RoomResponse,
)
def mark_room_available(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    if room.status != "cleaning":
        raise HTTPException(
            status_code=400,
            detail="Only rooms in cleaning status can be marked as available",
        )

    room.status = "available"

    db.commit()
    db.refresh(room)

    return room


@router.patch(
    "/{room_id}/maintenance",
    response_model=RoomResponse,
)
def mark_room_maintenance(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
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
            detail="Only available rooms can be placed under maintenance",
        )

    room.status = "maintenance"

    db.commit()
    db.refresh(room)

    return room


@router.patch(
    "/{room_id}/restore",
    response_model=RoomResponse,
)
def restore_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    if room.status != "maintenance":
        raise HTTPException(
            status_code=400,
            detail="Only rooms under maintenance can be restored",
        )

    room.status = "available"

    db.commit()
    db.refresh(room)

    return room


@router.patch(
    "/{room_id}/inactive",
    response_model=RoomResponse,
)
def mark_room_inactive(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    if room.status == "inactive":
        raise HTTPException(
            status_code=400,
            detail="Room is already inactive",
        )

    room.status = "inactive"

    db.commit()
    db.refresh(room)

    return room


@router.patch(
    "/{room_id}/reactivate",
    response_model=RoomResponse,
)
def reactivate_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    if room.status != "inactive":
        raise HTTPException(
            status_code=400,
            detail="Only inactive rooms can be reactivated",
        )

    room.status = "available"

    db.commit()
    db.refresh(room)

    return room


@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .first()
    )

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    reservation_exists = (
        db.query(Reservation)
        .filter(Reservation.room_id == room_id)
        .first()
    )

    if reservation_exists:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete room because it has existing reservations. Set the room to inactive instead.",
        )

    db.delete(room)
    db.commit()

    return {
        "message": "Room deleted successfully",
    }