from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import Expense, User
from app.schemas.expense import ExpenseCreate, ExpenseResponse


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_expense = (
        db.query(Expense)
        .filter(Expense.expense_id == expense_data.expense_id)
        .first()
    )

    if existing_expense:
        raise HTTPException(
            status_code=400,
            detail="Expense ID already exists",
        )

    if expense_data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Expense amount must be greater than zero",
        )

    expense = Expense(
        expense_id=expense_data.expense_id,
        description=expense_data.description,
        category=expense_data.category,
        amount=expense_data.amount,
        expense_date=expense_data.expense_date,
        paid_by=expense_data.paid_by,
        payment_method=expense_data.payment_method,
        status=expense_data.status,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Expense).all()


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id)
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return expense


@router.patch(
    "/{expense_id}/approve",
    response_model=ExpenseResponse,
)
def approve_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id)
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    if expense.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending expenses can be approved",
        )

    expense.status = "approved"

    db.commit()
    db.refresh(expense)

    return expense


@router.patch(
    "/{expense_id}/pay",
    response_model=ExpenseResponse,
)
def pay_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id)
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    if expense.status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Only approved expenses can be paid",
        )

    expense.status = "paid"

    db.commit()
    db.refresh(expense)

    return expense


@router.patch(
    "/{expense_id}/cancel",
    response_model=ExpenseResponse,
)
def cancel_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id)
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    if expense.status == "paid":
        raise HTTPException(
            status_code=400,
            detail="Paid expenses cannot be cancelled",
        )

    if expense.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Expense is already cancelled",
        )

    expense.status = "cancelled"

    db.commit()
    db.refresh(expense)

    return expense


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id)
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted successfully",
    }