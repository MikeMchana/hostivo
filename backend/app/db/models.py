from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


# ============================================================
# USER / ADMIN
# ============================================================

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(30),
        default="admin",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# ROOMS
# ============================================================

class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    room_number: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    room_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    floor: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    price_per_night: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="available",
        nullable=False,
    )


# ============================================================
# CUSTOMERS
# ============================================================

class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="active",
        nullable=False,
    )


# ============================================================
# ROOM RESERVATIONS
# ============================================================

class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id"),
        nullable=False,
    )

    room_id: Mapped[int] = mapped_column(
        ForeignKey("rooms.id"),
        nullable=False,
    )

    check_in: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    check_out: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    guests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    total_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# MENU ITEMS
# ============================================================

class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    is_available: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# RESTAURANT TABLES
# ============================================================

class RestaurantTable(Base):
    __tablename__ = "restaurant_tables"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    table_number: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    section: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="available",
        nullable=False,
    )


# ============================================================
# RESTAURANT TABLE RESERVATIONS
# ============================================================

class RestaurantTableReservation(Base):
    __tablename__ = "restaurant_table_reservations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id"),
        nullable=False,
    )

    table_id: Mapped[int] = mapped_column(
        ForeignKey("restaurant_tables.id"),
        nullable=False,
    )

    reservation_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    reservation_time: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
    )

    guests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    special_requests: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# ORDERS
# ============================================================

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("customers.id"),
        nullable=True,
    )

    table_id: Mapped[int | None] = mapped_column(
        ForeignKey("restaurant_tables.id"),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    total_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# ORDER ITEMS
# ============================================================

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"),
        nullable=False,
    )

    menu_item_id: Mapped[int] = mapped_column(
        ForeignKey("menu_items.id"),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    unit_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    subtotal: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )


# ============================================================
# INVENTORY
# ============================================================

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    current_stock: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    minimum_stock: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    unit: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    cost_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    supplier: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="in_stock",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# EMPLOYEES
# ============================================================

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    department: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
    )

    date_joined: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="active",
        nullable=False,
    )


# ============================================================
# EXPENSES
# ============================================================

class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    expense_id: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    expense_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    paid_by: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    payment_method: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# PAYMENTS
# ============================================================

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    payment_id: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("customers.id"),
        nullable=True,
    )

    reservation_id: Mapped[int | None] = mapped_column(
        ForeignKey("reservations.id"),
        nullable=True,
    )

    order_id: Mapped[int | None] = mapped_column(
        ForeignKey("orders.id"),
        nullable=True,
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    payment_method: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    transaction_reference: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="completed",
        nullable=False,
    )

    payment_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# SYSTEM SETTINGS
# ============================================================

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    hotel_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Hostivo Hotel",
    )

    hotel_email: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="info@hostivo.com",
    )

    phone: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="+254 700 000 000",
    )

    address: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        default="Mombasa, Kenya",
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        default=(
            "A modern hotel and restaurant providing comfortable "
            "accommodation and quality dining experiences."
        ),
    )

    currency: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="KES - Kenyan Shilling",
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Africa/Nairobi",
    )

    language: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="English",
    )

    advance_booking: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=30,
    )

    check_in_time: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
        default="14:00",
    )

    check_out_time: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
        default="11:00",
    )

    cancellation_policy: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="24 hours",
    )

    restaurant_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Hostivo Restaurant",
    )

    opening_time: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
        default="07:00",
    )

    closing_time: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
        default="22:00",
    )

    email_notifications: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    reservation_notifications: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    payment_notifications: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    order_notifications: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    mpesa_enabled: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    card_enabled: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    cash_enabled: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    bank_transfer_enabled: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )