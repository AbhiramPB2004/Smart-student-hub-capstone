from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from core.guards import require_super_admin
from db.collections import complaints_collection

router = APIRouter(
    prefix="/superadmin",
    tags=["Super Admin"],
    dependencies=[Depends(require_super_admin)]
)

from bson import ObjectId

def serialize_mongo(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: serialize_mongo(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_mongo(i) for i in obj]
    return obj



@router.get("/complaints")
async def list_complaints(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    identity=Depends(require_super_admin)
):
    filters = {}

    if status:
        filters["status"] = status

    if category:
        filters["category"] = category

    if search:
        filters["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    cursor = complaints_collection.find(
        filters,
        {
            "student_id": 0  # 🔒 anonymous
        }
    ).sort("created_at", -1)

    complaints = []

    async for c in cursor:
        complaints.append(serialize_mongo(c))  # ✅ FIX

    return complaints



@router.patch("/complaints/{complaint_id}")
async def update_complaint(
    complaint_id: str,
    payload: dict,
    identity=Depends(require_super_admin)
):
    status = payload.get("status")
    remarks = payload.get("remarks")

    if status not in ["open", "in_review", "resolved", "closed"]:
        raise HTTPException(400, "Invalid status")

    result = await complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {
            "$set": {
                "status": status,
                "remarks": remarks,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Complaint not found")

    return {"message": "Complaint updated"}
