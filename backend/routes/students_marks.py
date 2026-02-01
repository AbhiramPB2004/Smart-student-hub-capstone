from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from core.guards import require_student
from db.collections import users_collection

router = APIRouter(
    prefix="/students/marks",   # ✅ CHANGED
    tags=["Students"],
    dependencies=[Depends(require_student)]
)


@router.get("")
async def get_my_marks(identity=Depends(require_student)):
    student = await users_collection.find_one(
        {"_id": ObjectId(identity["user_id"])},
        {"marks": 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    return student.get("marks", [])


@router.get("/me")
async def student_me(identity=Depends(require_student)):
    student = await users_collection.find_one(
        {"_id": ObjectId(identity["user_id"]), "role": "student"},
        {
            "name": 1,
            "email": 1,
            "status.profile_completed": 1
        }
    )

    if not student:
        raise HTTPException(404, "Student not found")

    return {
        "user_id": str(student["_id"]),
        "name": student.get("name"),
        "email": student.get("email"),
        "profile_completed": student.get("status", {}).get("profile_completed", False)
    }

