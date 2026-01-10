from fastapi import APIRouter, HTTPException, Response , Request , Depends
from db.collections import users_collection
from schemas.user_schema import UserLogin
from core.security import verify_password, create_token
from core.auth import COOKIE_NAME , get_current_user
from datetime import datetime
from core.security import hash_password

router = APIRouter(prefix="/auth")

@router.post("/login")
async def login(user: UserLogin, response: Response):

    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(404, "User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "user_id": str(db_user["_id"]),
        "role": db_user["role"]
    })


    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,   # set True in production (HTTPS)
        samesite="none",
        max_age=60*60*24,  # 1 day
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
    token = request.cookies.get("access_token")
    print(token)

    if not token:
        raise HTTPException(401, "Not authenticated")

    payload = get_current_user(request)

    return {
        "user_id": payload["user_id"],
        "role": payload["role"]
    }


@router.post("/set-password")
async def set_password(token: str, new_password: str):

    user = await users_collection.find_one({"reset_token": token})

    if not user:
        raise HTTPException(400, "Invalid token")

    if user["reset_token_exp"] < datetime.utcnow():
        raise HTTPException(400, "Token expired")

    hashed = hash_password(new_password)

    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": hashed,
                "is_active": True
            },
            "$unset": {
                "reset_token": "",
                "reset_token_exp": ""
            }
        }
    )

    return {"message": "Password set successfully"}
