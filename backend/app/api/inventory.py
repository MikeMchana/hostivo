from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import InventoryItem, User
from app.schemas.inventory_item import (
    InventoryItemCreate,
    InventoryItemResponse,
)


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)


@router.post("/", response_model=InventoryItemResponse)
def create_inventory_item(
    item_data: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = InventoryItem(
        name=item_data.name,
        category=item_data.category,
        current_stock=item_data.current_stock,
        minimum_stock=item_data.minimum_stock,
        unit=item_data.unit,
        cost_price=item_data.cost_price,
        supplier=item_data.supplier,
        status=item_data.status,
    )

    if item.current_stock <= 0:
        item.status = "out_of_stock"
    elif item.current_stock <= item.minimum_stock:
        item.status = "low_stock"
    else:
        item.status = "in_stock"

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.get("/", response_model=list[InventoryItemResponse])
def get_inventory_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(InventoryItem).all()


@router.get("/{item_id}", response_model=InventoryItemResponse)
def get_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found",
        )

    return item


@router.patch(
    "/{item_id}/add-stock",
    response_model=InventoryItemResponse,
)
def add_stock(
    item_id: int,
    quantity: Decimal,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found",
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero",
        )

    item.current_stock += quantity

    if item.current_stock <= 0:
        item.status = "out_of_stock"
    elif item.current_stock <= item.minimum_stock:
        item.status = "low_stock"
    else:
        item.status = "in_stock"

    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/{item_id}/remove-stock",
    response_model=InventoryItemResponse,
)
def remove_stock(
    item_id: int,
    quantity: Decimal,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found",
        )

    if quantity <= 0:
        raise HTTPException(
        status_code=400,
            detail="Quantity must be greater than zero",
        )

    if quantity > item.current_stock:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock",
        )

    item.current_stock -= quantity

    if item.current_stock <= 0:
        item.status = "out_of_stock"
    elif item.current_stock <= item.minimum_stock:
        item.status = "low_stock"
    else:
        item.status = "in_stock"

    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/{item_id}/restock",
    response_model=InventoryItemResponse,
)
def restock_item(
    item_id: int,
    quantity: Decimal,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found",
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero",
        )

    item.current_stock += quantity

    if item.current_stock <= 0:
        item.status = "out_of_stock"
    elif item.current_stock <= item.minimum_stock:
        item.status = "low_stock"
    else:
        item.status = "in_stock"

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{item_id}")
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Inventory item deleted successfully",
    }