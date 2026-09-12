from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import RestaurantTable, User
from app.schemas.restaurant_table import (
    RestaurantTableCreate,
    RestaurantTableResponse,
)


router = APIRouter(
    prefix="/restaurant-tables",
    tags=["Restaurant Tables"],
)


@router.post("/", response_model=RestaurantTableResponse)
def create_restaurant_table(
    table_data: RestaurantTableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_table = (
        db.query(RestaurantTable)
        .filter(
            RestaurantTable.table_number == table_data.table_number
        )
        .first()
    )

    if existing_table:
        raise HTTPException(
            status_code=400,
            detail="Table number already exists",
        )

    table = RestaurantTable(
        table_number=table_data.table_number,
        section=table_data.section,
        capacity=table_data.capacity,
        status=table_data.status,
    )

    db.add(table)
    db.commit()
    db.refresh(table)

    return table


@router.get("/", response_model=list[RestaurantTableResponse])
def get_restaurant_tables(
    db: Session = Depends(get_db),
):
    return db.query(RestaurantTable).all()


@router.get("/{table_id}", response_model=RestaurantTableResponse)
def get_restaurant_table(
    table_id: int,
    db: Session = Depends(get_db),
):
    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == table_id)
        .first()
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Restaurant table not found",
        )

    return table


@router.patch(
    "/{table_id}/reserve",
    response_model=RestaurantTableResponse,
)
def reserve_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == table_id)
        .first()
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Restaurant table not found",
        )

    if table.status != "available":
        raise HTTPException(
            status_code=400,
            detail="Only available tables can be reserved",
        )

    table.status = "reserved"

    db.commit()
    db.refresh(table)

    return table


@router.patch(
    "/{table_id}/occupy",
    response_model=RestaurantTableResponse,
)
def occupy_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == table_id)
        .first()
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Restaurant table not found",
        )

    if table.status not in ["available", "reserved"]:
        raise HTTPException(
            status_code=400,
            detail="Only available or reserved tables can be occupied",
        )

    table.status = "occupied"

    db.commit()
    db.refresh(table)

    return table


@router.patch(
    "/{table_id}/release",
    response_model=RestaurantTableResponse,
)
def release_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == table_id)
        .first()
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Restaurant table not found",
        )

    if table.status != "occupied":
        raise HTTPException(
            status_code=400,
            detail="Only occupied tables can be released",
        )

    table.status = "available"

    db.commit()
    db.refresh(table)

    return table


@router.delete("/{table_id}")
def delete_restaurant_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    table = (
        db.query(RestaurantTable)
        .filter(RestaurantTable.id == table_id)
        .first()
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Restaurant table not found",
        )

    db.delete(table)
    db.commit()

    return {
        "message": "Restaurant table deleted successfully",
    }