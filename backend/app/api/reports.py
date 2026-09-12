from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import (
    Expense,
    MenuItem,
    Order,
    OrderItem,
    Payment,
    Reservation,
    Room,
    User,
)


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


def get_period_dates(period: str):
    today = date.today()

    if period == "today":
        return today, today

    if period == "week":
        start_date = today - timedelta(days=today.weekday())
        return start_date, today

    if period == "month":
        start_date = today.replace(day=1)
        return start_date, today

    if period == "year":
        start_date = today.replace(month=1, day=1)
        return start_date, today

    return today.replace(day=1), today


@router.get("/dashboard")
def get_dashboard_report(
    period: str = Query(
        "month",
        pattern="^(today|week|month|year)$",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    start_date, end_date = get_period_dates(period)

    start_datetime = datetime.combine(
        start_date,
        datetime.min.time(),
    )

    end_datetime = datetime.combine(
        end_date + timedelta(days=1),
        datetime.min.time(),
    )

    completed_payments = (
        db.query(Payment)
        .filter(
            Payment.status == "completed",
            Payment.payment_date >= start_datetime,
            Payment.payment_date < end_datetime,
        )
        .all()
    )

    total_revenue = sum(
        float(payment.amount or 0)
        for payment in completed_payments
    )

    room_revenue = sum(
        float(payment.amount or 0)
        for payment in completed_payments
        if payment.reservation_id is not None
        and payment.order_id is None
    )

    restaurant_revenue = sum(
        float(payment.amount or 0)
        for payment in completed_payments
        if payment.order_id is not None
        and payment.reservation_id is None
    )

    other_revenue = sum(
        float(payment.amount or 0)
        for payment in completed_payments
        if (
            payment.reservation_id is None
            and payment.order_id is None
        )
        or (
            payment.reservation_id is not None
            and payment.order_id is not None
        )
    )

    paid_expenses = (
        db.query(Expense)
        .filter(
            Expense.status == "paid",
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date,
        )
        .all()
    )

    total_expenses = sum(
        float(expense.amount or 0)
        for expense in paid_expenses
    )

    net_income = total_revenue - total_expenses

    period_reservations = (
        db.query(Reservation)
        .filter(
            Reservation.check_in <= end_date,
            Reservation.check_out > start_date,
        )
        .all()
    )

    active_reservations = [
        reservation
        for reservation in period_reservations
        if reservation.status in [
            "pending",
            "confirmed",
            "checked_in",
        ]
    ]

    completed_reservations = [
        reservation
        for reservation in period_reservations
        if reservation.status == "checked_out"
    ]

    cancelled_reservations = [
        reservation
        for reservation in period_reservations
        if reservation.status == "cancelled"
    ]

    rooms = db.query(Room).all()

    total_rooms = len(
        [
            room
            for room in rooms
            if room.status != "inactive"
        ]
    )

    available_rooms = len(
        [
            room
            for room in rooms
            if room.status == "available"
        ]
    )

    occupied_rooms = len(
        [
            room
            for room in rooms
            if room.status == "occupied"
        ]
    )

    cleaning_rooms = len(
        [
            room
            for room in rooms
            if room.status == "cleaning"
        ]
    )

    maintenance_rooms = len(
        [
            room
            for room in rooms
            if room.status == "maintenance"
        ]
    )

    period_days = (
        end_date - start_date
    ).days + 1

    available_room_nights = (
        total_rooms * period_days
    )

    booked_room_nights = 0

    for reservation in period_reservations:
        if reservation.status == "cancelled":
            continue

        effective_start = max(
            reservation.check_in,
            start_date,
        )

        effective_end = min(
            reservation.check_out,
            end_date + timedelta(days=1),
        )

        nights = (
            effective_end - effective_start
        ).days

        if nights > 0:
            booked_room_nights += nights

    occupancy = (
        (
            booked_room_nights
            / available_room_nights
        )
        * 100
        if available_room_nights > 0
        else 0
    )

    completed_orders = (
        db.query(Order)
        .filter(
            Order.status == "completed",
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .all()
    )

    pending_orders = (
        db.query(func.count(Order.id))
        .filter(
            Order.status == "pending",
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .scalar()
        or 0
    )

    preparing_orders = (
        db.query(func.count(Order.id))
        .filter(
            Order.status == "preparing",
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .scalar()
        or 0
    )

    ready_orders = (
        db.query(func.count(Order.id))
        .filter(
            Order.status == "ready",
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .scalar()
        or 0
    )

    cancelled_orders = (
        db.query(func.count(Order.id))
        .filter(
            Order.status == "cancelled",
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .scalar()
        or 0
    )

    total_orders = (
        db.query(func.count(Order.id))
        .filter(
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .scalar()
        or 0
    )

    room_performance = []

    for room in rooms:
        if room.status == "inactive":
            continue

        room_reservations = [
            reservation
            for reservation in period_reservations
            if reservation.room_id == room.id
            and reservation.status != "cancelled"
        ]

        bookings = len(room_reservations)

        nights = 0
        reservation_revenue = 0

        for reservation in room_reservations:
            effective_start = max(
                reservation.check_in,
                start_date,
            )

            effective_end = min(
                reservation.check_out,
                end_date + timedelta(days=1),
            )

            reservation_nights = (
                effective_end - effective_start
            ).days

            if reservation_nights > 0:
                nights += reservation_nights

            reservation_revenue += float(
                reservation.total_amount or 0
            )

        room_capacity_nights = period_days

        room_occupancy = (
            (nights / room_capacity_nights) * 100
            if room_capacity_nights > 0
            else 0
        )

        room_performance.append(
            {
                "room": room.room_number,
                "type": room.room_type,
                "bookings": bookings,
                "nights": nights,
                "revenue": reservation_revenue,
                "occupancy": round(
                    room_occupancy,
                    1,
                ),
            }
        )

    room_performance.sort(
        key=lambda item: item["revenue"],
        reverse=True,
    )

    menu_rows = (
        db.query(
            MenuItem.id,
            MenuItem.name,
            MenuItem.category,
            func.coalesce(
                func.sum(OrderItem.quantity),
                0,
            ).label("orders"),
            func.coalesce(
                func.sum(OrderItem.subtotal),
                0,
            ).label("revenue"),
        )
        .join(
            OrderItem,
            OrderItem.menu_item_id == MenuItem.id,
        )
        .join(
            Order,
            Order.id == OrderItem.order_id,
        )
        .filter(
            Order.status == "completed",
            Order.created_at >= start_datetime,
            Order.created_at < end_datetime,
        )
        .group_by(
            MenuItem.id,
            MenuItem.name,
            MenuItem.category,
        )
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .limit(10)
        .all()
    )

    top_menu_items = [
        {
            "name": item.name,
            "category": item.category,
            "orders": int(item.orders or 0),
            "revenue": float(item.revenue or 0),
        }
        for item in menu_rows
    ]

    daily_revenue = []

    current_date = start_date

    while current_date <= end_date:
        next_date = current_date + timedelta(days=1)

        day_start = datetime.combine(
            current_date,
            datetime.min.time(),
        )

        day_end = datetime.combine(
            next_date,
            datetime.min.time(),
        )

        day_revenue = sum(
            float(payment.amount or 0)
            for payment in completed_payments
            if (
                payment.payment_date >= day_start
                and payment.payment_date < day_end
            )
        )

        daily_revenue.append(
            {
                "date": current_date.isoformat(),
                "day": current_date.strftime("%a"),
                "revenue": day_revenue,
            }
        )

        current_date = next_date

    return {
        "period": {
            "type": period,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
        "financial": {
            "total_revenue": total_revenue,
            "room_revenue": room_revenue,
            "restaurant_revenue": restaurant_revenue,
            "other_revenue": other_revenue,
            "total_expenses": total_expenses,
            "net_income": net_income,
        },
        "occupancy": {
            "rate": round(
                occupancy,
                1,
            ),
            "booked_room_nights": booked_room_nights,
            "available_room_nights": available_room_nights,
        },
        "rooms": {
            "total": total_rooms,
            "available": available_rooms,
            "occupied": occupied_rooms,
            "cleaning": cleaning_rooms,
            "maintenance": maintenance_rooms,
            "performance": room_performance,
        },
        "reservations": {
            "total": len(period_reservations),
            "active": len(active_reservations),
            "completed": len(completed_reservations),
            "cancelled": len(cancelled_reservations),
        },
        "orders": {
            "total": total_orders,
            "pending": pending_orders,
            "preparing": preparing_orders,
            "ready": ready_orders,
            "completed": len(completed_orders),
            "cancelled": cancelled_orders,
        },
        "menu": {
            "top_items": top_menu_items,
        },
        "daily_revenue": daily_revenue,
    }


@router.get("/orders")
def get_order_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(
            Order.status,
            func.count(Order.id).label("count"),
            func.coalesce(
                func.sum(Order.total_amount),
                0,
            ).label("revenue"),
        )
        .group_by(Order.status)
        .all()
    )

    return [
        {
            "status": order.status,
            "count": order.count,
            "revenue": float(order.revenue or 0),
        }
        for order in orders
    ]


@router.get("/reservations")
def get_reservation_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservations = (
        db.query(
            Reservation.status,
            func.count(Reservation.id).label("count"),
            func.coalesce(
                func.sum(Reservation.total_amount),
                0,
            ).label("revenue"),
        )
        .group_by(Reservation.status)
        .all()
    )

    return [
        {
            "status": reservation.status,
            "count": reservation.count,
            "revenue": float(
                reservation.revenue or 0
            ),
        }
        for reservation in reservations
    ]


@router.get("/expenses")
def get_expense_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = (
        db.query(
            Expense.category,
            func.count(Expense.id).label("count"),
            func.coalesce(
                func.sum(Expense.amount),
                0,
            ).label("amount"),
        )
        .group_by(Expense.category)
        .all()
    )

    return [
        {
            "category": expense.category,
            "count": expense.count,
            "amount": float(
                expense.amount or 0
            ),
        }
        for expense in expenses
    ]


@router.get("/payments")
def get_payment_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payments = (
        db.query(
            Payment.payment_method,
            Payment.status,
            func.count(Payment.id).label("count"),
            func.coalesce(
                func.sum(Payment.amount),
                0,
            ).label("amount"),
        )
        .group_by(
            Payment.payment_method,
            Payment.status,
        )
        .all()
    )

    return [
        {
            "payment_method": payment.payment_method,
            "status": payment.status,
            "count": payment.count,
            "amount": float(
                payment.amount or 0
            ),
        }
        for payment in payments
    ]