from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from bson import ObjectId

from db.collections import users_collection , complaints_collection
from core.guards import require_super_admin
from services.token_service import generate_reset_token
from services.email_service import send_email
from services.email_templates import build_password_email

router = APIRouter(
    prefix="/superadmin/admins",
    tags=["University Admins"],
    dependencies=[Depends(require_super_admin)]
)

# ➕ Create University Admin
@router.post("")
async def create_admin(payload: dict, user=Depends(require_super_admin)):
    email = payload.get("email")

    if not email:
        raise HTTPException(400, "Email is required")

    existing = await users_collection.find_one({"email": email})
    if existing:
        raise HTTPException(400, "Admin already exists")

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    doc = {
        "name": payload.get("name"),
        "email": email,
        "role": "admin",

        "password": None,
        "is_active": False,
        "created_at": datetime.utcnow(),
        "last_login": None,

        "admin_meta": {
            "university_id": payload.get("university_id"),
            "created_by": user["user_id"]
        },

        "onboarding": {
            "reset_token": reset_token,
            "reset_token_exp": expiry
        }
    }

    await users_collection.insert_one(doc)

    await send_email(
        email,
        "Activate your University Admin Account",
        build_password_email(doc["name"], reset_token)
    )

    return {"message": "University admin created"}

# 📄 List University Admins
@router.get("")
async def list_admins():
    admins = []

    async for doc in users_collection.find(
        {"role": "admin"},
        {"password": 0, "onboarding.reset_token": 0}
    ):
        doc["_id"] = str(doc["_id"])
        admins.append(doc)

    return admins

# 🔁 Activate / Deactivate
@router.patch("/{admin_id}/status")
async def update_admin_status(admin_id: str, is_active: bool):
    result = await users_collection.update_one(
        {"_id": ObjectId(admin_id), "role": "admin"},
        {
            "$set": {
                "is_active": is_active,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Admin not found")

    return {"message": "Admin status updated"}

# 🔐 Reset Admin Password
@router.post("/{admin_id}/reset-password")
async def reset_admin_password(admin_id: str):
    admin = await users_collection.find_one(
        {"_id": ObjectId(admin_id), "role": "admin"}
    )

    if not admin:
        raise HTTPException(404, "Admin not found")

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    await users_collection.update_one(
        {"_id": ObjectId(admin_id)},
        {
            "$set": {
                "onboarding.reset_token": reset_token,
                "onboarding.reset_token_exp": expiry,
                "is_active": False
            }
        }
    )

    await send_email(
        admin["email"],
        "Reset your Admin Account Password",
        build_password_email(admin["name"], reset_token)
    )

    return {"message": "Password reset email sent"}

from core.guards import require_super_admin

@router.get("/complaints")
async def list_complaints(identity=Depends(require_super_admin)):
    cursor = complaints_collection.find(
        {"university_id": identity["user_id"]}
    ).sort("created_at", -1)

    results = []
    async for c in cursor:
        c["_id"] = str(c["_id"])
        c["raised_by"] = str(c["raised_by"])
        results.append(c)

    return results



