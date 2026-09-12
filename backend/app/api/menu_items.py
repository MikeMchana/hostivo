from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import MenuItem
from app.schemas.menu_item import (
    MenuItemCreate,
    MenuItemResponse,
    MenuItemUpdate,
)


router = APIRouter(
    prefix="/menu-items",
    tags=["Menu Items"],
)


@router.post("/", response_model=MenuItemResponse)
def create_menu_item(
    menu_item_data: MenuItemCreate,
    db: Session = Depends(get_db),
):
    menu_item = MenuItem(
        name=menu_item_data.name,
        category=menu_item_data.category,
        description=menu_item_data.description,
        price=menu_item_data.price,
        is_available=menu_item_data.is_available,
    )

    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)

    return menu_item


@router.get("/", response_model=list[MenuItemResponse])
def get_menu_items(
    db: Session = Depends(get_db),
):
    menu_items = db.query(MenuItem).all()

    return menu_items


@router.get("/{menu_item_id}", response_model=MenuItemResponse)
def get_menu_item(
    menu_item_id: int,
    db: Session = Depends(get_db),
):
    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == menu_item_id)
        .first()
    )

    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    return menu_item


@router.patch(
    "/{menu_item_id}",
    response_model=MenuItemResponse,
)
def update_menu_item(
    menu_item_id: int,
    menu_item_data: MenuItemUpdate,
    db: Session = Depends(get_db),
):
    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == menu_item_id)
        .first()
    )

    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    menu_item.name = menu_item_data.name
    menu_item.category = menu_item_data.category
    menu_item.description = menu_item_data.description
    menu_item.price = menu_item_data.price

    db.commit()
    db.refresh(menu_item)

    return menu_item


@router.patch(
    "/{menu_item_id}/unavailable",
    response_model=MenuItemResponse,
)
def mark_menu_item_unavailable(
    menu_item_id: int,
    db: Session = Depends(get_db),
):
    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == menu_item_id)
        .first()
    )

    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    if not menu_item.is_available:
        raise HTTPException(
            status_code=400,
            detail="Menu item is already unavailable",
        )

    menu_item.is_available = False

    db.commit()
    db.refresh(menu_item)

    return menu_item


@router.patch(
    "/{menu_item_id}/available",
    response_model=MenuItemResponse,
)
def mark_menu_item_available(
    menu_item_id: int,
    db: Session = Depends(get_db),
):
    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == menu_item_id)
        .first()
    )

    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    if menu_item.is_available:
        raise HTTPException(
            status_code=400,
            detail="Menu item is already available",
        )

    menu_item.is_available = True

    db.commit()
    db.refresh(menu_item)

    return menu_item


@router.delete("/{menu_item_id}")
def delete_menu_item(
    menu_item_id: int,
    db: Session = Depends(get_db),
):
    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == menu_item_id)
        .first()
    )

    if not menu_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    db.delete(menu_item)
    db.commit()

    return {
        "message": "Menu item deleted successfully",
    }