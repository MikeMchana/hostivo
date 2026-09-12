from datetime import date

from pydantic import BaseModel, ConfigDict


class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    role: str
    department: str
    phone: str
    email: str | None = None
    date_joined: date
    status: str = "active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)