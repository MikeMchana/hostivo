from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Hostivo"
    app_version: str = "1.0.0"
    environment: str = "development"

    database_url: str

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    mpesa_enabled: bool = True
    mpesa_environment: str = "sandbox"
    mpesa_consumer_key: str = ""
    mpesa_consumer_secret: str = ""
    mpesa_shortcode: str = ""
    mpesa_passkey: str = ""
    mpesa_callback_url: str = ""

    class Config:
        env_file = ".env"


settings = Settings()