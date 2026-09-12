from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import MenuItem, Order, OrderItem
from app.schemas.order_item import OrderItemCreate, OrderItemResponse


router = APIRouter(
    prefix="/order-items",
    tags=["Order Items"],
)


@router.post("/", response_model=OrderItemResponse)
def create_order_item(
    item_data: OrderItemCreate,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == item_data.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status in ["completed", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot add items to a completed or cancelled order",
        )

    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == item_data.menu_item_id)
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
            detail="Menu item is currently unavailable",
        )

    if item_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero",
        )

    # Always use the menu item's current price
    unit_price = menu_item.price

    # Calculate subtotal automatically
    subtotal = unit_price * item_data.quantity

    item = OrderItem(
        order_id=item_data.order_id,
        menu_item_id=item_data.menu_item_id,
        quantity=item_data.quantity,
        unit_price=unit_price,
        subtotal=subtotal,
    )

    db.add(item)

    # Update order total
    order.total_amount = (
        order.total_amount + subtotal
    )

    db.commit()
    db.refresh(item)

    return item


@router.get("/", response_model=list[OrderItemResponse])
def get_order_items(
    db: Session = Depends(get_db),
):
    return db.query(OrderItem).all()


@router.get("/{item_id}", response_model=OrderItemResponse)
def get_order_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(OrderItem)
        .filter(OrderItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found",
        )

    return item


@router.delete("/{item_id}")
def delete_order_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(OrderItem)
        .filter(OrderItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found",
        )

    order = (
        db.query(Order)
        .filter(Order.id == item.order_id)
        .first()
    )

    if order and order.status in ["completed", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot remove items from a completed or cancelled order",
        )

    # Subtract the item's subtotal from the order total
    if order:
        order.total_amount = max(
            0,
            order.total_amount - item.subtotal,
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Order item deleted successfully",
    }