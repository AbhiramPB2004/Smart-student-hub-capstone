from fastapi import APIRouter, HTTPException, Response , Request , Depends
from db.collections import (
    users_collection,
    platform_admins_collection,
    super_admins_collection
)
from bson import ObjectId
from schemas.user_schema import UserLogin
from schemas.password_schema import SetPasswordRequest
from core.security import verify_password, create_token
from core.auth import COOKIE_NAME , get_current_user
from datetime import datetime
from core.security import hash_password

router = APIRouter(prefix="/auth")

async def find_user_by_email(email: str):
    user = await platform_admins_collection.find_one({"email": email})
    if user:
        user["_source"] = "platform_admins"
        return user

    user = await super_admins_collection.find_one({"email": email})
    if user:
        user["_source"] = "super_admins"
        return user

    user = await users_collection.find_one({"email": email})
    if user:
        user["_source"] = "users"
        return user

    return None

async def find_user_by_reset_token(token: str):
    user = await platform_admins_collection.find_one(
        {"onboarding.reset_token": token}
    )
    if user:
        user["_source"] = "platform_admins"
        return user

    user = await super_admins_collection.find_one(
        {"onboarding.reset_token": token}
    )
    if user:
        user["_source"] = "super_admins"
        return user

    user = await users_collection.find_one(
        {"onboarding.reset_token": token}
    )
    if user:
        user["_source"] = "users"
        return user

    return None



@router.post("/login")
async def login(user: UserLogin, response: Response):

    db_user = await find_user_by_email(user.email)
    if not db_user:
        raise HTTPException(404, "User not found")

    if not db_user.get("is_active"):
        raise HTTPException(403, "Account inactive")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "user_id": str(db_user["_id"]),
        "role": db_user["role"],
        "source": db_user["_source"]   # 🔑 VERY IMPORTANT
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24,
    )

    return {"message": "Login successful"}



@router.post("/logout")
async def logout(request: Request, response: Response):

    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(status_code=400, detail="No active session")

    response.delete_cookie(COOKIE_NAME)

    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_me(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(401, "Not authenticated")

    payload = get_current_user(request)

    user_id = payload.get("user_id")
    role = payload.get("role")
    source = payload.get("source")

    if not user_id or not role or not source:
        raise HTTPException(401, "Invalid token")

    # 🔐 PLATFORM ADMIN
    if role == "platform_admin":
        user = await platform_admins_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0}
        )
        if not user:
            raise HTTPException(401, "User not found")

        return {
            "user_id": user_id,
            "role": role
        }

    # 🏫 SUPER ADMIN (University Admin)
    if role == "super_admin":
        user = await super_admins_collection.find_one(
            {"_id": ObjectId(user_id)},
            {
                "password": 0,
                "onboarding.reset_token": 0,
                "onboarding.reset_token_exp": 0
            }
        )
        if not user:
            raise HTTPException(401, "User not found")

        return {
            "user_id": user_id,
            "role": role,
            "verification": {
                "status": user.get("verification", {}).get("status")
            },
            "university": {
                "name": user.get("university", {}).get("name")
            }
        }

    # 👨‍🏫 FACULTY / 🎓 STUDENT
    if role in ["faculty", "student"]:
        user = await users_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0}
        )
        if not user:
            raise HTTPException(401, "User not found")

        return {
            "user_id": user_id,
            "role": role
        }

    raise HTTPException(401, "Invalid role")

@router.post("/set-password")
async def set_password(data: SetPasswordRequest):

    user = await find_user_by_reset_token(data.token)
    if not user:
        raise HTTPException(400, "Invalid token")

    if user["onboarding"]["reset_token_exp"] < datetime.utcnow():
        raise HTTPException(400, "Token expired")

    hashed = hash_password(data.new_password)

    collection_map = {
        "platform_admins": platform_admins_collection,
        "super_admins": super_admins_collection,
        "users": users_collection
    }

    await collection_map[user["_source"]].update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": hashed,
                "is_active": True,
                "onboarding.email_verified": True,
                "meta.last_updated": datetime.utcnow()
            },
            "$unset": {
                "onboarding.reset_token": "",
                "onboarding.reset_token_exp": ""
            }
        }
    )

    return {"message": "Password set successfully"}


