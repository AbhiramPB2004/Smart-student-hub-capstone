


from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from core.guards import require_student
from db.collections import complaints_collection, users_collection
from db.gridfs import fs




router = APIRouter(
    prefix="/students",  
    tags=["Students"],
    dependencies=[Depends(require_student)]
)


@router.post("/profile")
async def update_student_profile(
    payload: dict,
    identity=Depends(require_student)
):
    required_profile_fields = [
        "phone",
        "dob",
        "gender",
        "blood_group",
        "address",
        "photo_url",
    ]

    required_academic_fields = [
        "current_year",
        "semester",
    ]

    # 🔒 Validate profile fields
    for field in required_profile_fields:
        if not payload.get(field):
            raise HTTPException(400, f"{field} is required")

    for field in required_academic_fields:
        if payload.get(field) is None:
            raise HTTPException(400, f"{field} is required")

    result = await users_collection.update_one(
        {"_id": ObjectId(identity["user_id"]), "role": "student"},
        {
            "$set": {
                "profile.phone": payload["phone"],
                "profile.dob": payload["dob"],
                "profile.gender": payload["gender"],
                "profile.blood_group": payload["blood_group"],
                "profile.address": payload["address"],
                "profile.photo_url": payload["photo_url"],

                "academic.current_year": int(payload["current_year"]),
                "academic.semester": int(payload["semester"]),

                "status.profile_completed": True,
                "meta.last_updated": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Student not found")

    return {"message": "Profile completed successfully"}




@router.post("/profile/photo")
async def upload_profile_photo(
    photo: UploadFile = File(...),
    identity=Depends(require_student)
):
    if photo.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(400, "Only JPG or PNG images allowed")

    photo_bytes = await photo.read()
    if not photo_bytes:
        raise HTTPException(400, "Empty file")

    # 🗄 Store image in GridFS
    file_id = fs.put(
        photo_bytes,
        filename=photo.filename,
        content_type=photo.content_type,
        uploaded_at=datetime.utcnow(),
        uploaded_by=ObjectId(identity["user_id"])
    )

    # 🔗 Store ACCESS URL (string) — DO NOT CHANGE KEY
    photo_url = f"/files/{file_id}"

    await users_collection.update_one(
        {"_id": ObjectId(identity["user_id"]), "role": "student"},
        {
            "$set": {
                "profile.photo_url": photo_url,
                "meta.last_updated": datetime.utcnow()
            }
        }
    )

    return {
        "message": "Profile photo uploaded",
        "photo_url": photo_url
    }



@router.post("/complaints")
async def create_complaint(
    payload: dict,
    identity=Depends(require_student)
):
    required_fields = ["category", "subject", "description"]

    for f in required_fields:
        if not payload.get(f):
            raise HTTPException(400, f"{f} is required")

    student = await users_collection.find_one(
        {"_id": ObjectId(identity["user_id"])},
        {"name": 1, "email": 1, "academic.university": 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    complaint = {
        "raised_by": ObjectId(identity["user_id"]),
        "raised_by_name": student["name"],
        "raised_by_email": student["email"],
        "university_id": student.get("academic", {}).get("university"),
        "category": payload["category"],
        "subject": payload["subject"],
        "description": payload["description"],
        "against": payload.get("against", {"type": "none", "ref_id": None}),
        "status": "open",
        "remarks": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await complaints_collection.insert_one(complaint)

    return {"message": "Complaint submitted successfully"}

@router.get("/complaints")
async def my_complaints(identity=Depends(require_student)):
    cursor = complaints_collection.find(
        {"raised_by": ObjectId(identity["user_id"])}
    ).sort("created_at", -1)

    results = []
    async for c in cursor:
        c["_id"] = str(c["_id"])
        c["raised_by"] = str(c["raised_by"])
        results.append(c)

    return results
