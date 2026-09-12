import base64
from datetime import datetime
from typing import Any

import requests

from app.core.config import settings


def get_mpesa_base_url() -> str:
    if settings.mpesa_environment == "production":
        return "https://api.safaricom.co.ke"

    return "https://sandbox.safaricom.co.ke"


def get_access_token() -> str:
    if not settings.mpesa_consumer_key:
        raise RuntimeError("M-Pesa consumer key is not configured")

    if not settings.mpesa_consumer_secret:
        raise RuntimeError("M-Pesa consumer secret is not configured")

    url = f"{get_mpesa_base_url()}/oauth/v1/generate?grant_type=client_credentials"

    response = requests.get(
        url,
        auth=(
            settings.mpesa_consumer_key,
            settings.mpesa_consumer_secret,
        ),
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    return data["access_token"]


def generate_password(timestamp: str) -> str:
    raw_password = (
        f"{settings.mpesa_shortcode}"
        f"{settings.mpesa_passkey}"
        f"{timestamp}"
    )

    return base64.b64encode(
        raw_password.encode("utf-8")
    ).decode("utf-8")


def initiate_stk_push(
    phone_number: str,
    amount: float,
    account_reference: str,
    transaction_description: str,
) -> dict[str, Any]:
    if not settings.mpesa_enabled:
        raise RuntimeError("M-Pesa payments are disabled")

    if settings.mpesa_environment != "sandbox":
        raise RuntimeError(
            "Production M-Pesa payments are not enabled in this environment"
        )

    if not settings.mpesa_shortcode:
        raise RuntimeError("M-Pesa shortcode is not configured")

    if not settings.mpesa_passkey:
        raise RuntimeError("M-Pesa passkey is not configured")

    if not settings.mpesa_callback_url:
        raise RuntimeError(
            "M-Pesa callback URL is not configured"
        )

    token = get_access_token()

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    password = generate_password(timestamp)

    url = (
        f"{get_mpesa_base_url()}"
        "/mpesa/stkpush/v1/processrequest"
    )

    payload = {
        "BusinessShortCode": settings.mpesa_shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": settings.mpesa_shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.mpesa_callback_url,
        "AccountReference": account_reference,
        "TransactionDesc": transaction_description,
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=30,
    )

    response.raise_for_status()

    return response.json()