from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime, timedelta
from bson import ObjectId

from db.collections import platform_admins_collection
from core.guards import require_platform_admin
from services.token_service import generate_reset_token
from services.email_service import send_email
from services.email_templates import build_password_email
from schemas.platform_admin_schema import CreatePlatformAdminRequest

router = APIRouter(
    prefix="/platform/admins",
    tags=["Platform Admins"],
    dependencies=[Depends(require_platform_admin)]
)


@router.get("")
async def list_platform_admins():
    admins = []

    async for doc in platform_admins_collection.find(
        {},
        {"password": 0, "onboarding.reset_token": 0}
    ):
        doc["_id"] = str(doc["_id"])
        admins.append(doc)

    return admins


@router.post("")
async def create_platform_admin(data: CreatePlatformAdminRequest):
    existing = await platform_admins_collection.find_one(
        {"email": data.email}
    )
    if existing:
        raise HTTPException(400, "Platform admin already exists")

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    doc = {
        "name": data.name,
        "email": data.email,
        "role": "platform_admin",

        "password": None,
        "is_active": False,
        "created_at": datetime.utcnow(),
        "last_login": None,

        "onboarding": {
            "reset_token": reset_token,
            "reset_token_exp": expiry,
            "email_verified": False
        },

        "meta": {
            "created_by": "platform_admin",
            "last_updated": datetime.utcnow()
        }
    }

    await platform_admins_collection.insert_one(doc)

    await send_email(
        to_email=data.email,
        subject="Activate your Platform Admin account",
        html=build_password_email(data.name, reset_token)
    )

    return {"message": "Platform admin created successfully"}


@router.patch("/{admin_id}/status")
async def update_platform_admin_status(
    admin_id: str,
    is_active: bool = Query(...)
):
    result = await platform_admins_collection.update_one(
        {"_id": ObjectId(admin_id)},
        {
            "$set": {
                "is_active": is_active,
                "meta.last_updated": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Platform admin not found")

    return {"message": "Status updated"}
