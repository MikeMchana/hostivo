from pydantic import BaseModel, ConfigDict, Field


class SettingsBase(BaseModel):
    hotel_name: str = Field(
        min_length=1,
        max_length=100,
    )

    hotel_email: str = Field(
        min_length=1,
        max_length=100,
    )

    phone: str = Field(
        min_length=1,
        max_length=30,
    )

    address: str = Field(
        min_length=1,
        max_length=200,
    )

    description: str = Field(
        min_length=1,
        max_length=500,
    )

    currency: str = Field(
        min_length=1,
        max_length=50,
    )

    timezone: str = Field(
        min_length=1,
        max_length=100,
    )

    language: str = Field(
        min_length=1,
        max_length=50,
    )

    advance_booking: int = Field(
        ge=0,
        le=3650,
    )

    check_in_time: str = Field(
        min_length=5,
        max_length=5,
    )

    check_out_time: str = Field(
        min_length=5,
        max_length=5,
    )

    cancellation_policy: str = Field(
        min_length=1,
        max_length=50,
    )

    restaurant_name: str = Field(
        min_length=1,
        max_length=100,
    )

    opening_time: str = Field(
        min_length=5,
        max_length=5,
    )

    closing_time: str = Field(
        min_length=5,
        max_length=5,
    )

    email_notifications: bool = True
    reservation_notifications: bool = True
    payment_notifications: bool = True
    order_notifications: bool = True

    mpesa_enabled: bool = True
    card_enabled: bool = True
    cash_enabled: bool = True
    bank_transfer_enabled: bool = True


class SettingsUpdate(SettingsBase):
    pass


class SettingsResponse(SettingsBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )