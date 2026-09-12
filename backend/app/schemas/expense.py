from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ExpenseBase(BaseModel):
    expense_id: str
    description: str
    category: str
    amount: float
    expense_date: date
    paid_by: str
    payment_method: str
    status: str = "pending"


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)