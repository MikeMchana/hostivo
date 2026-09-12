from pydantic import BaseModel, ConfigDict


class OrderItemBase(BaseModel):
    order_id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    subtotal: float


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    unit_price: float
    subtotal: float


class OrderItemResponse(OrderItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)