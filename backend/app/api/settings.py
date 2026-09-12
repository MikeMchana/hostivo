from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import SystemSettings, User
from app.schemas.settings import SettingsResponse, SettingsUpdate


router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


def get_or_create_settings(db: Session) -> SystemSettings:
    settings = (
        db.query(SystemSettings)
        .filter(SystemSettings.id == 1)
        .first()
    )

    if settings:
        return settings

    settings = SystemSettings(id=1)

    db.add(settings)
    db.commit()
    db.refresh(settings)

    return settings


@router.get(
    "/",
    response_model=SettingsResponse,
)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_or_create_settings(db)


@router.put(
    "/",
    response_model=SettingsResponse,
)
def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settings = get_or_create_settings(db)

    settings.hotel_name = settings_data.hotel_name
    settings.hotel_email = settings_data.hotel_email
    settings.phone = settings_data.phone
    settings.address = settings_data.address
    settings.description = settings_data.description

    settings.currency = settings_data.currency
    settings.timezone = settings_data.timezone
    settings.language = settings_data.language

    settings.advance_booking = settings_data.advance_booking
    settings.check_in_time = settings_data.check_in_time
    settings.check_out_time = settings_data.check_out_time
    settings.cancellation_policy = settings_data.cancellation_policy

    settings.restaurant_name = settings_data.restaurant_name
    settings.opening_time = settings_data.opening_time
    settings.closing_time = settings_data.closing_time

    settings.email_notifications = settings_data.email_notifications
    settings.reservation_notifications = (
        settings_data.reservation_notifications
    )
    settings.payment_notifications = (
        settings_data.payment_notifications
    )
    settings.order_notifications = (
        settings_data.order_notifications
    )

    settings.mpesa_enabled = settings_data.mpesa_enabled
    settings.card_enabled = settings_data.card_enabled
    settings.cash_enabled = settings_data.cash_enabled
    settings.bank_transfer_enabled = (
        settings_data.bank_transfer_enabled
    )

    db.commit()
    db.refresh(settings)

    return settings