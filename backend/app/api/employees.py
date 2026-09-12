from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import Employee, User
from app.schemas.employee import EmployeeCreate, EmployeeResponse


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post("/", response_model=EmployeeResponse)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_employee = (
        db.query(Employee)
        .filter(Employee.employee_id == employee_data.employee_id)
        .first()
    )

    if existing_employee:
        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists",
        )

    existing_phone = (
        db.query(Employee)
        .filter(Employee.phone == employee_data.phone)
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Employee phone number already exists",
        )

    if employee_data.email:
        existing_email = (
            db.query(Employee)
            .filter(Employee.email == employee_data.email)
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Employee email already exists",
            )

    employee = Employee(
        employee_id=employee_data.employee_id,
        full_name=employee_data.full_name,
        role=employee_data.role,
        department=employee_data.department,
        phone=employee_data.phone,
        email=employee_data.email,
        date_joined=employee_data.date_joined,
        status=employee_data.status,
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee


@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Employee).all()


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return employee


@router.patch(
    "/{employee_id}/activate",
    response_model=EmployeeResponse,
)
def activate_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    if employee.status == "active":
        raise HTTPException(
            status_code=400,
            detail="Employee is already active",
        )

    employee.status = "active"

    db.commit()
    db.refresh(employee)

    return employee


@router.patch(
    "/{employee_id}/leave",
    response_model=EmployeeResponse,
)
def place_employee_on_leave(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    if employee.status != "active":
        raise HTTPException(
            status_code=400,
            detail="Only active employees can be placed on leave",
        )

    employee.status = "on_leave"

    db.commit()
    db.refresh(employee)

    return employee


@router.patch(
    "/{employee_id}/deactivate",
    response_model=EmployeeResponse,
)
def deactivate_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    if employee.status == "inactive":
        raise HTTPException(
            status_code=400,
            detail="Employee is already inactive",
        )

    employee.status = "inactive"

    db.commit()
    db.refresh(employee)

    return employee


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully",
    }