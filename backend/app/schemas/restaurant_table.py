from pydantic import BaseModel, ConfigDict


class RestaurantTableBase(BaseModel):
    table_number: str
    section: str
    capacity: int
    status: str = "available"


class RestaurantTableCreate(RestaurantTableBase):
    pass


class RestaurantTableResponse(RestaurantTableBase):
    id: int

    model_config = ConfigDict(from_attributes=True)