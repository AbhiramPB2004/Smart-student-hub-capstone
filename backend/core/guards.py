from fastapi import Depends, HTTPException
from bson import ObjectId

from core.auth import get_current_user
from db.collections import super_admins_collection


def require_platform_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "platform_admin":
        raise HTTPException(403, "Platform admin access required")

    if not user.get("is_active", True):
        raise HTTPException(403, "Account inactive")

    return user


def require_super_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "super_admin":
        raise HTTPException(403, "Super admin access required")

    # 🔒 Fetch super admin from DB to verify status
    admin = super_admins_collection.find_one(
        {"_id": ObjectId(user["user_id"])},
        {"verification.status": 1, "is_active": 1}
    )

    if not admin:
        raise HTTPException(403, "Account not found")

    if not admin.get("is_active"):
        raise HTTPException(403, "Account inactive")

    if admin.get("verification", {}).get("status") != "approved":
        raise HTTPException(
            403,
            "University verification pending or rejected"
        )

    return user
