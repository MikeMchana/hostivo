from datetime import date

from pydantic import BaseModel


class PublicBookingCreate(BaseModel):
    full_name: str
    phone: str
    email: str | None = None

    room_id: int
    check_in: date
    check_out: date
    guests: int
    total_amount: float


class PublicBookingResponse(BaseModel):
    id: int
    customer_id: int
    room_id: int
    check_in: date
    check_out: date
    guests: int
    total_amount: float
    status: str