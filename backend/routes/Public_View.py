from fastapi import APIRouter
from db.collections import faculty_collection

router = APIRouter(
    prefix="/faculty",
    tags=["Faculty Public"]
)

@router.get("/list")
async def list_faculty_for_students():
    faculty = []

    async for doc in faculty_collection.find(
        {"is_active": True},
        {"name": 1, "email": 1}
    ):
        faculty.append({
            "_id": str(doc["_id"]),
            "name": doc["name"],
            "email": doc["email"]
        })

    return faculty
