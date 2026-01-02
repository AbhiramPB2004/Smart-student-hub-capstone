from fastapi import APIRouter, HTTPException, Response , Request
from db.collections import users_collection
from schemas.user_schema import UserLogin
from core.security import verify_password, create_token
from core.auth import COOKIE_NAME

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
        secure=False,   # set True in production (HTTPS)
        samesite="lax",
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
