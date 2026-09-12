from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import (
    Customer,
    MenuItem,
    Order,
    OrderItem,
    RestaurantTable,
    User,
)
from app.schemas.order import OrderCreate, OrderResponse


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post("/", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    if not order_data.items:
        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one item",
        )

    # ---------------------------------------------------------
    # CUSTOMER
    # ---------------------------------------------------------

    customer = None

    if order_data.customer_id is not None:
        customer = (
            db.query(Customer)
            .filter(Customer.id == order_data.customer_id)
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found",
            )

    elif order_data.customer_phone:
        customer = (
            db.query(Customer)
            .filter(Customer.phone == order_data.customer_phone)
            .first()
        )

        if customer:
            if order_data.customer_name:
                customer.full_name = order_data.customer_name
        else:
            customer = Customer(
                full_name=order_data.customer_name or "Guest",
                phone=order_data.customer_phone,
                status="active",
            )

            db.add(customer)
            db.flush()

    # ---------------------------------------------------------
    # TABLE
    # ---------------------------------------------------------

    table = None

    if order_data.table_id is not None:
        table = (
            db.query(RestaurantTable)
            .filter(RestaurantTable.id == order_data.table_id)
            .first()
        )

        if not table:
            raise HTTPException(
                status_code=404,
                detail="Restaurant table not found",
            )

        if table.status not in ["available", "occupied"]:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Orders cannot be placed on a reserved "
                    "or unavailable table"
                ),
            )

        if table.status == "available":
            table.status = "occupied"

    # ---------------------------------------------------------
    # MENU ITEMS
    # ---------------------------------------------------------

    calculated_total = 0

    validated_items = []

    for item_data in order_data.items:

        if item_data.quantity < 1:
            raise HTTPException(
                status_code=400,
                detail="Item quantity must be at least 1",
            )

        menu_item = (
            db.query(MenuItem)
            .filter(
                MenuItem.id == item_data.menu_item_id
            )
            .first()
        )

        if not menu_item:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Menu item "
                    f"{item_data.menu_item_id} not found"
                ),
            )

        unit_price = float(item_data.unit_price)

        subtotal = unit_price * item_data.quantity

        calculated_total += subtotal

        validated_items.append(
            {
                "menu_item_id": menu_item.id,
                "quantity": item_data.quantity,
                "unit_price": unit_price,
                "subtotal": subtotal,
            }
        )

    # ---------------------------------------------------------
    # CREATE ORDER
    # ---------------------------------------------------------

    order = Order(
        customer_id=customer.id if customer else None,
        table_id=table.id if table else None,
        status="pending",
        total_amount=calculated_total,
    )

    db.add(order)
    db.flush()

    # ---------------------------------------------------------
    # CREATE ORDER ITEMS
    # ---------------------------------------------------------

    for item in validated_items:

        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=item["menu_item_id"],
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            subtotal=item["subtotal"],
        )

        db.add(order_item)

    db.commit()
    db.refresh(order)

    return order


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Order).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
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

    return order


@router.patch(
    "/{order_id}/preparing",
    response_model=OrderResponse,
)
def mark_order_preparing(
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
            detail="Only pending orders can be moved to preparing",
        )

    order.status = "preparing"

    db.commit()
    db.refresh(order)

    return order


@router.patch(
    "/{order_id}/ready",
    response_model=OrderResponse,
)
def mark_order_ready(
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

    return order


@router.patch(
    "/{order_id}/complete",
    response_model=OrderResponse,
)
def complete_order(
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

    if order.status != "ready":
        raise HTTPException(
            status_code=400,
            detail="Only ready orders can be completed",
        )

    order.status = "completed"

    if order.table_id is not None:
        table = (
            db.query(RestaurantTable)
            .filter(RestaurantTable.id == order.table_id)
            .first()
        )

        if table and table.status == "occupied":
            table.status = "available"

    db.commit()
    db.refresh(order)

    return order


@router.patch(
    "/{order_id}/cancel",
    response_model=OrderResponse,
)
def cancel_order(
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

    if order.status in ["completed", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Order cannot be cancelled",
        )

    order.status = "cancelled"

    if order.table_id is not None:
        table = (
            db.query(RestaurantTable)
            .filter(RestaurantTable.id == order.table_id)
            .first()
        )

        if table and table.status == "occupied":
            table.status = "available"

    db.commit()
    db.refresh(order)

    return order


@router.delete("/{order_id}")
def delete_order(
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

    db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).delete(
        synchronize_session=False
    )

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully",
    }