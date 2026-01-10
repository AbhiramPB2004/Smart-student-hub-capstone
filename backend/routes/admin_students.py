from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
from db.collections import users_collection
from core.auth import get_current_user
from services.token_service import generate_reset_token
from services.email_service import send_email
from services.email_templates import build_password_email
from bson import ObjectId

def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(403, "Admin access required")
    return user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)]
)

@router.get("/students")
async def get_all_students(
    university: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    program: Optional[str] = Query(None),
    batch_year: Optional[int] = Query(None),
    semester: Optional[int] = Query(None),
    is_active: Optional[bool] = Query(None),
    profile_completed: Optional[bool] = Query(None),
    faculty_verified: Optional[bool] = Query(None),

    skip: int = 0,
    limit: int = 50
):
    filters = {"role": "student"}

    if university:
        filters["academic.university"] = university
    if department:
        filters["academic.department"] = department
    if program:
        filters["academic.program"] = program
    if batch_year:
        filters["academic.batch_year"] = batch_year
    if semester:
        filters["academic.semester"] = semester
    if is_active is not None:
        filters["is_active"] = is_active
    if profile_completed is not None:
        filters["status.profile_completed"] = profile_completed
    if faculty_verified is not None:
        filters["status.faculty_verified"] = faculty_verified

    cursor = (
        users_collection
        .find(filters, {"password": 0, "onboarding.reset_token": 0})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    students = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        students.append(doc)

    total = await users_collection.count_documents(filters)

    return {
        "total": total,
        "count": len(students),
        "skip": skip,
        "limit": limit,
        "students": students
    }

@router.get("/students/{student_id}")
async def get_student(student_id: str):
    student = await users_collection.find_one(
        {"_id": ObjectId(student_id)},
        {"password": 0, "onboarding.reset_token": 0}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    student["_id"] = str(student["_id"])
    return student

@router.patch("/students/{student_id}/status")
async def update_student_status(student_id: str, is_active: bool):
    result = await users_collection.update_one(
        {"_id": ObjectId(student_id)},
        {
            "$set": {
                "is_active": is_active,
                "meta.last_updated": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Student not found")

    return {"message": "Student status updated"}

@router.post("/students/{student_id}/reset-password")
async def reset_student_password(student_id: str):
    student = await users_collection.find_one({"_id": ObjectId(student_id)})

    if not student:
        raise HTTPException(404, "Student not found")

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    await users_collection.update_one(
        {"_id": ObjectId(student_id)},
        {
            "$set": {
                "onboarding.reset_token": reset_token,
                "onboarding.reset_token_exp": expiry,
                "is_active": False,
                "meta.last_updated": datetime.utcnow()
            }
        }
    )

    await send_email(
        to_email=student["email"],
        subject="Reset Your Smart Student Hub Password",
        html=build_password_email(student["name"], reset_token)
    )

    return {"message": "Password reset email sent"}

@router.delete("/students/{student_id}")
async def block_student(student_id: str):
    result = await users_collection.update_one(
        {"_id": ObjectId(student_id)},
        {
            "$set": {
                "status.blocked": True,
                "is_active": False,
                "meta.last_updated": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Student not found")

    return {"message": "Student blocked successfully"}

