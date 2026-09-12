from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ReservationBase(BaseModel):
    customer_id: int
    room_id: int
    check_in: date
    check_out: date
    guests: int
    total_amount: float
    status: str = "pending"


class ReservationCreate(ReservationBase):
    pass


class ReservationResponse(ReservationBase):
    id: int
    created_at: datetime

    # Related customer information
    customer_name: str | None = None
    customer_email: str | None = None
    customer_phone: str | None = None

    # Related room information
    room_number: str | None = None
    room_type: str | None = None

    model_config = ConfigDict(from_attributes=True)