from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaymentBase(BaseModel):
    payment_id: str
    customer_id: int | None = None
    reservation_id: int | None = None
    order_id: int | None = None
    amount: float
    payment_method: str
    transaction_reference: str | None = None
    status: str = "completed"


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: int
    payment_date: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)