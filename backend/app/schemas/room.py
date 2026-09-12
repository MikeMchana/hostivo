from enum import Enum

from pydantic import BaseModel, ConfigDict


class RoomStatus(str, Enum):
    AVAILABLE = "available"
    CLEANING = "cleaning"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"


class RoomBase(BaseModel):
    room_number: str
    room_type: str
    floor: int
    capacity: int
    price_per_night: float
    status: RoomStatus = RoomStatus.AVAILABLE


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    room_number: str
    room_type: str
    floor: int
    capacity: int
    price_per_night: float


class RoomResponse(RoomBase):
    id: int

    model_config = ConfigDict(from_attributes=True)