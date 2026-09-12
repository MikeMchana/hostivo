from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import Order, OrderItem, User


router = APIRouter(
    prefix="/kitchen",
    tags=["Kitchen"],
)


@router.get("/orders")
def get_kitchen_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(
            Order.status.in_(
                ["pending", "preparing", "ready"]
            )
        )
        .order_by(Order.created_at.asc())
        .all()
    )

    kitchen_orders = []

    for order in orders:
        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        kitchen_orders.append(
            {
                "order_id": order.id,
                "customer_id": order.customer_id,
                "table_id": order.table_id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {
                        "item_id": item.id,
                        "menu_item_id": item.menu_item_id,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "subtotal": item.subtotal,
                    }
                    for item in items
                ],
            }
        )

    return kitchen_orders


@router.get("/orders/pending")
def get_pending_kitchen_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(Order.status == "pending")
        .order_by(Order.created_at.asc())
        .all()
    )

    kitchen_orders = []

    for order in orders:
        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        kitchen_orders.append(
            {
                "order_id": order.id,
                "customer_id": order.customer_id,
                "table_id": order.table_id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {
                        "item_id": item.id,
                        "menu_item_id": item.menu_item_id,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "subtotal": item.subtotal,
                    }
                    for item in items
                ],
            }
        )

    return kitchen_orders


@router.get("/orders/preparing")
def get_preparing_kitchen_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(Order.status == "preparing")
        .order_by(Order.created_at.asc())
        .all()
    )

    kitchen_orders = []

    for order in orders:
        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        kitchen_orders.append(
            {
                "order_id": order.id,
                "customer_id": order.customer_id,
                "table_id": order.table_id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {
                        "item_id": item.id,
                        "menu_item_id": item.menu_item_id,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "subtotal": item.subtotal,
                    }
                    for item in items
                ],
            }
        )

    return kitchen_orders


@router.get("/orders/ready")
def get_ready_kitchen_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(Order.status == "ready")
        .order_by(Order.created_at.asc())
        .all()
    )

    kitchen_orders = []

    for order in orders:
        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        kitchen_orders.append(
            {
                "order_id": order.id,
                "customer_id": order.customer_id,
                "table_id": order.table_id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {
                        "item_id": item.id,
                        "menu_item_id": item.menu_item_id,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "subtotal": item.subtotal,
                    }
                    for item in items
                ],
            }
        )

    return kitchen_orders


@router.get("/orders/{order_id}")
def get_kitchen_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status not in ["pending", "preparing", "ready"]:
        raise HTTPException(
            status_code=400,
            detail="Order is not currently active in the kitchen",
        )

    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    return {
        "order_id": order.id,
        "customer_id": order.customer_id,
        "table_id": order.table_id,
        "status": order.status,
        "total_amount": order.total_amount,
        "created_at": order.created_at,
        "items": [
            {
                "item_id": item.id,
                "menu_item_id": item.menu_item_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.subtotal,
            }
            for item in items
        ],
    }


@router.patch("/orders/{order_id}/start")
def start_kitchen_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending orders can be started in the kitchen",
        )

    order.status = "preparing"

    db.commit()
    db.refresh(order)

    return {
        "message": "Order moved to preparing",
        "order_id": order.id,
        "status": order.status,
    }


@router.patch("/orders/{order_id}/ready")
def mark_kitchen_order_ready(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status != "preparing":
        raise HTTPException(
            status_code=400,
            detail="Only preparing orders can be marked as ready",
        )

    order.status = "ready"

    db.commit()
    db.refresh(order)

    return {
        "message": "Order marked as ready",
        "order_id": order.id,
        "status": order.status,
    }