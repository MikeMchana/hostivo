from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.rooms import router as rooms_router
from app.api.customers import router as customers_router
from app.api.reservations import router as reservations_router
from app.api.menu_items import router as menu_items_router
from app.api.restaurant_tables import router as restaurant_tables_router
from app.api import table_reservations
from app.api.orders import router as orders_router
from app.api.order_items import router as order_items_router
from app.api.inventory import router as inventory_router
from app.api.employees import router as employees_router
from app.api.expenses import router as expenses_router
from app.api.payments import router as payments_router
from app.api.kitchen import router as kitchen_router
from app.api.reports import router as reports_router
from app.api.settings import router as settings_router
from app.api.auth import router as auth_router


from app.db.database import engine
from app.db.models import (
    Base,
    Room,
    Customer,
    Reservation,
    MenuItem,
    RestaurantTable,
    RestaurantTableReservation,
    Order,
    OrderItem,
    InventoryItem,
    Employee,
    Expense,
    Payment,
    SystemSettings,
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Hostivo API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://hostivo.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(rooms_router)
app.include_router(customers_router)
app.include_router(reservations_router)
app.include_router(menu_items_router)
app.include_router(restaurant_tables_router)
app.include_router(table_reservations.router)
app.include_router(orders_router)
app.include_router(order_items_router)
app.include_router(inventory_router)
app.include_router(employees_router)
app.include_router(expenses_router)
app.include_router(payments_router)
app.include_router(kitchen_router)
app.include_router(reports_router)
app.include_router(settings_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Hostivo API is running",
    }


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
    }