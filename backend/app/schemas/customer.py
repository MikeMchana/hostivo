from pydantic import BaseModel, ConfigDict


class CustomerBase(BaseModel):
    full_name: str
    phone: str
    email: str | None = None
    address: str | None = None
    status: str = "active"


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int

    model_config = ConfigDict(from_attributes=True)