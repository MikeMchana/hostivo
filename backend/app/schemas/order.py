from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.order_item import OrderItemCreate, OrderItemResponse


class OrderBase(BaseModel):
    customer_id: int | None = None
    table_id: int | None = None
    status: str = "pending"
    total_amount: float = 0


class OrderCreate(OrderBase):
    customer_name: str | None = None
    customer_phone: str | None = None
    order_type: str | None = None
    room_number: str | None = None
    table_number: str | None = None
    special_instructions: str | None = None

    items: list[OrderItemCreate] = []


class OrderResponse(OrderBase):
    id: int
    created_at: datetime
    items: list[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)