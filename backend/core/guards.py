from fastapi import Depends, HTTPException
from bson import ObjectId
from fastapi import Depends, HTTPException
from core.auth import get_current_user  # adjust import
from core.auth import get_current_user
from db.collections import super_admins_collection


def require_platform_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "platform_admin":
        raise HTTPException(403, "Platform admin access required")

    if not user.get("is_active", True):
        raise HTTPException(403, "Account inactive")

    return user


async def require_super_admin(user=Depends(get_current_user)):
    # 👇 THIS IS THE KEY FIX
    admin = user
    print(user)
    if not isinstance(admin, dict):
        raise HTTPException(status_code=401, detail="Invalid session")


    if admin.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Super admin access required")

    return admin

async def require_faculty(user=Depends(get_current_user)):
    # Ensure user is authenticated
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Ensure correct role
    if user.get("role") != "faculty":
        raise HTTPException(
            status_code=403,
            detail="Faculty access required"
        )

    # Ensure account is active


    return user


async def require_student(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(401, "Not authenticated")

    if user.get("role") != "student":
        raise HTTPException(403, "Student access required")

    if not user.get("is_active", True):
        raise HTTPException(403, "Account inactive")

    return user