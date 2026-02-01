from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List

from core.guards import require_faculty
from db.collections import faculty_collection, users_collection
from db.gridfs import fs

router = APIRouter(
    prefix="/faculty",
    tags=["Faculty"],
    dependencies=[Depends(require_faculty)]
)

# ======================================================
# FACULTY PROFILE
# ======================================================

@router.get("/me")
async def faculty_me(identity=Depends(require_faculty)):
    faculty = await faculty_collection.find_one(
        {"_id": ObjectId(identity["user_id"])},
        {"password": 0}
    )

    if not faculty:
        raise HTTPException(404, "Faculty not found")

    faculty["_id"] = str(faculty["_id"])
    return faculty


# ======================================================
# FACULTY DASHBOARD
# ======================================================

@router.get("/dashboard")
async def faculty_dashboard(identity=Depends(require_faculty)):
    faculty = await faculty_collection.find_one(
        {"_id": ObjectId(identity["user_id"])},
        {"verification_stats": 1, "permissions": 1}
    )

    if not faculty:
        raise HTTPException(404, "Faculty not found")

    return {
        "permissions": faculty.get("permissions", {}),
        "verified_count": faculty.get("verification_stats", {}).get("verified_count", 0),
        "rejected_count": faculty.get("verification_stats", {}).get("rejected_count", 0),
    }


# ======================================================
# PENDING CERTIFICATES (ASSIGNED ONLY)
# ======================================================

@router.get("/certificates/pending")
async def pending_certificates(identity=Depends(require_faculty)):
    faculty_id = ObjectId(identity["user_id"])

    faculty = await faculty_collection.find_one(
        {"_id": faculty_id},
        {"permissions": 1}
    )

    if not faculty or not faculty.get("permissions", {}).get("can_verify_certificates"):
        raise HTTPException(403, "No permission")

    cursor = users_collection.find(
        {
            "certifications": {
                "$elemMatch": {
                    "status": "pending",
                    "assigned_faculty_ids": faculty_id
                }
            }
        },
        {"name": 1, "register_no": 1, "certifications": 1}
    )

    results = []

    async for student in cursor:
        for cert in student.get("certifications", []):
            # 🔒 STRICT FILTER
            if (
                cert.get("status") == "pending"
                and faculty_id in cert.get("assigned_faculty_ids", [])
            ):
                results.append({
                    "certificate_id": str(cert["_id"]),
                    "student_id": str(student["_id"]),
                    "student_name": student["name"],
                    "register_no": student.get("register_no"),
                    "title": cert["title"],
                    "file_id": str(cert["file_id"]),
                    "submitted_at": cert["submitted_at"],
                })

    return results



# ======================================================
# APPROVE CERTIFICATE
# ======================================================

@router.post("/certificates/{certificate_id}/approve")
async def approve_certificate(
    certificate_id: str,
    identity=Depends(require_faculty)
):
    faculty_id = ObjectId(identity["user_id"])

    result = await users_collection.update_one(
        {"certifications._id": ObjectId(certificate_id)},
        {
            "$set": {
                "certifications.$[c].status": "approved",
                "certifications.$[c].verified_by": faculty_id,
                "certifications.$[c].verified_at": datetime.utcnow()
            }
        },
        array_filters=[
            {
                "c._id": ObjectId(certificate_id),
                "c.assigned_faculty_ids": faculty_id,
                "c.status": "pending"
            }
        ]
    )

    if result.modified_count == 0:
        raise HTTPException(403, "Not authorized or already processed")

    await faculty_collection.update_one(
        {"_id": faculty_id},
        {"$inc": {"verification_stats.verified_count": 1}}
    )

    return {"message": "Certificate approved"}



# ======================================================
# REJECT CERTIFICATE
# ======================================================

@router.post("/certificates/{certificate_id}/reject")
async def reject_certificate(
    certificate_id: str,
    payload: dict,
    identity=Depends(require_faculty)
):
    remarks = payload.get("remarks")
    if not remarks:
        raise HTTPException(400, "Remarks required")

    faculty_id = ObjectId(identity["user_id"])

    result = await users_collection.update_one(
        {"certifications._id": ObjectId(certificate_id)},
        {
            "$set": {
                "certifications.$[c].status": "rejected",
                "certifications.$[c].remarks": remarks,
                "certifications.$[c].verified_by": faculty_id,
                "certifications.$[c].verified_at": datetime.utcnow()
            }
        },
        array_filters=[
            {
                "c._id": ObjectId(certificate_id),
                "c.assigned_faculty_ids": faculty_id,
                "c.status": "pending"
            }
        ]
    )

    if result.modified_count == 0:
        raise HTTPException(403, "Not authorized or already processed")

    await faculty_collection.update_one(
        {"_id": faculty_id},
        {"$inc": {"verification_stats.rejected_count": 1}}
    )

    return {"message": "Certificate rejected"}

@router.get("/internships/pending")
async def pending_internships(identity=Depends(require_faculty)):
    faculty_id = ObjectId(identity["user_id"])

    faculty = await faculty_collection.find_one(
        {"_id": faculty_id},
        {"permissions": 1}
    )

    if not faculty or not faculty.get("permissions", {}).get("can_verify_internships"):
        raise HTTPException(403, "No permission to verify internships")

    cursor = users_collection.find(
        {
            "internships": {
                "$elemMatch": {
                    "status": "pending",
                    "assigned_faculty_ids": faculty_id
                }
            }
        },
        {"name": 1, "register_no": 1, "internships": 1}
    )

    results = []

    async for student in cursor:
        for internship in student.get("internships", []):
            if (
                internship.get("status") == "pending"
                and faculty_id in internship.get("assigned_faculty_ids", [])
            ):
                results.append({
                    "internship_id": str(internship["_id"]),
                    "student_id": str(student["_id"]),
                    "student_name": student["name"],
                    "register_no": student.get("register_no"),
                    "company": internship.get("company"),
                    "role": internship.get("role"),
                    "duration": internship.get("duration"),
                    "file_id": str(internship.get("file_id")),
                    "submitted_at": internship.get("submitted_at"),
                })

    return results

@router.post("/internships/{internship_id}/approve")
async def approve_internship(
    internship_id: str,
    identity=Depends(require_faculty)
):
    faculty_id = ObjectId(identity["user_id"])

    result = await users_collection.update_one(
        {
            "internships._id": ObjectId(internship_id),
            "internships.assigned_faculty_ids": faculty_id
        },
        {
            "$set": {
                "internships.$.status": "approved",
                "internships.$.verified_by": faculty_id,
                "internships.$.verified_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(403, "Not authorized to approve")

    await faculty_collection.update_one(
        {"_id": faculty_id},
        {"$inc": {"verification_stats.verified_count": 1}}
    )

    return {"message": "Internship approved"}

@router.post("/internships/{internship_id}/reject")
async def reject_internship(
    internship_id: str,
    payload: dict,
    identity=Depends(require_faculty)
):
    remarks = payload.get("remarks")
    if not remarks:
        raise HTTPException(400, "Remarks required")

    faculty_id = ObjectId(identity["user_id"])

    result = await users_collection.update_one(
        {
            "internships._id": ObjectId(internship_id),
            "internships.assigned_faculty_ids": faculty_id
        },
        {
            "$set": {
                "internships.$.status": "rejected",
                "internships.$.remarks": remarks,
                "internships.$.verified_by": faculty_id,
                "internships.$.verified_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(403, "Not authorized to reject")

    await faculty_collection.update_one(
        {"_id": faculty_id},
        {"$inc": {"verification_stats.rejected_count": 1}}
    )

    return {"message": "Internship rejected"}

# ======================================================
# PENDING PROJECTS (ASSIGNED ONLY)
# ======================================================

@router.get("/projects/pending")
async def pending_projects(identity=Depends(require_faculty)):
    faculty_id = ObjectId(identity["user_id"])

    cursor = users_collection.find(
        {
            "projects": {
                "$elemMatch": {
                    "status": "pending",
                    "assigned_faculty_ids": faculty_id
                }
            }
        },
        {"name": 1, "register_no": 1, "projects": 1}
    )

    results = []

    async for student in cursor:
        for p in student.get("projects", []):
            if (
                p.get("status") == "pending"
                and faculty_id in p.get("assigned_faculty_ids", [])
            ):
                results.append({
                    "project_id": str(p["_id"]),
                    "student_id": str(student["_id"]),
                    "student_name": student["name"],
                    "register_no": student.get("register_no"),
                    "title": p["title"],
                    "github_url": p["github_url"],
                    "deployment_url": p.get("deployment_url"),
                    "submitted_at": p["submitted_at"],
                })

    return results


@router.post("/projects/{project_id}/approve")
async def approve_project(
    project_id: str,
    identity=Depends(require_faculty)
):
    faculty_id = ObjectId(identity["user_id"])

    result = await users_collection.update_one(
        {
            "projects._id": ObjectId(project_id),
            "projects.assigned_faculty_ids": faculty_id
        },
        {
            "$set": {
                "projects.$.status": "approved",
                "projects.$.verified_by": faculty_id,
                "projects.$.verified_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(403, "Not authorized")

    return {"message": "Project approved"}

@router.post("/projects/{project_id}/reject")
async def reject_project(
    project_id: str,
    payload: dict,
    identity=Depends(require_faculty)
):
    remarks = payload.get("remarks")
    if not remarks:
        raise HTTPException(400, "Remarks required")

    faculty_id = ObjectId(identity["user_id"])

    result = await users_collection.update_one(
        {
            "projects._id": ObjectId(project_id),
            "projects.assigned_faculty_ids": faculty_id
        },
        {
            "$set": {
                "projects.$.status": "rejected",
                "projects.$.remarks": remarks,
                "projects.$.verified_by": faculty_id,
                "projects.$.verified_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(403, "Not authorized")

    return {"message": "Project rejected"}
