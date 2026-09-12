from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InventoryItemBase(BaseModel):
    name: str
    category: str
    current_stock: float = 0
    minimum_stock: float = 0
    unit: str
    cost_price: float
    supplier: str | None = None
    status: str = "in_stock"


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemResponse(InventoryItemBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)