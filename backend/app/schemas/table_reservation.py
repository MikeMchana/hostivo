from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class PublicTableReservationCreate(BaseModel):
    full_name: str
    phone: str
    email: str | None = None
    reservation_date: date
    reservation_time: str
    guests: int
    special_requests: str | None = None


class TableReservationResponse(BaseModel):
    id: int
    customer_id: int
    table_id: int

    reservation_date: date
    reservation_time: str
    guests: int

    special_requests: str | None = None
    status: str

    created_at: datetime

    customer_name: str | None = None
    customer_email: str | None = None
    customer_phone: str | None = None

    table_number: str | None = None
    table_section: str | None = None

    model_config = ConfigDict(from_attributes=True)