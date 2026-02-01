from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from typing import List

from core.guards import require_student
from db.collections import users_collection

router = APIRouter(
    prefix="/students/projects",
    tags=["Student Projects"],
    dependencies=[Depends(require_student)]
)

# ======================================================
# SUBMIT PROJECT
# ======================================================

@router.post("/submit")
async def submit_project(
    payload: dict,
    identity=Depends(require_student)
):
    required = ["title", "description", "github_url", "assigned_faculty_ids"]
    for r in required:
        if not payload.get(r):
            raise HTTPException(400, f"{r} is required")

    project = {
        "_id": ObjectId(),
        "title": payload["title"],
        "description": payload["description"],
        "github_url": payload["github_url"],
        "deployment_url": payload.get("deployment_url"),
        "assigned_faculty_ids": [
            ObjectId(fid) for fid in payload["assigned_faculty_ids"]
        ],
        "status": "pending",
        "remarks": None,
        "submitted_at": datetime.utcnow(),
        "verified_by": None,
        "verified_at": None
    }

    await users_collection.update_one(
        {"_id": ObjectId(identity["user_id"])},
        {"$push": {"projects": project}}
    )

    return {"message": "Project submitted successfully"}

@router.get("")
async def list_projects(identity=Depends(require_student)):
    student = await users_collection.find_one(
        {"_id": ObjectId(identity["user_id"])},
        {"projects": 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    projects = []

    for p in student.get("projects", []):
        projects.append({
            "_id": str(p["_id"]),
            "title": p.get("title"),
            "description": p.get("description"),
            "github_url": p.get("github_url"),
            "deployment_url": p.get("deployment_url"),
            "status": p.get("status"),
            "remarks": p.get("remarks"),
            "assigned_faculty_ids": [
                str(fid) for fid in p.get("assigned_faculty_ids", [])
            ],
            "submitted_at": (
                p["submitted_at"].isoformat()
                if p.get("submitted_at") else None
            ),
            "verified_by": (
                str(p["verified_by"])
                if p.get("verified_by") else None
            ),
            "verified_at": (
                p["verified_at"].isoformat()
                if p.get("verified_at") else None
            )
        })

    return projects

