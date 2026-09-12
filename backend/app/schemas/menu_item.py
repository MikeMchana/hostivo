from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MenuItemBase(BaseModel):
    name: str
    category: str
    description: str | None = None
    price: float
    is_available: bool = True


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemUpdate(BaseModel):
    name: str
    category: str
    description: str | None = None
    price: float


class MenuItemResponse(MenuItemBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)