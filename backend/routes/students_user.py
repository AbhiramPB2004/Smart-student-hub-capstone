from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
import os, uuid, shutil
from db.gridfs import fs
from core.guards import require_student
from db.collections import users_collection
from typing import List

UPLOAD_DIR = "uploads/certificates"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/students/certificates",   # ✅ CHANGED
    tags=["Students"],
    dependencies=[Depends(require_student)]
)


@router.post("/upload")
async def upload_certificate(
    title: str = Form(...),
    assigned_faculty_ids: List[str] = Form(...),
    file: UploadFile = File(...),
    identity=Depends(require_student)
):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF allowed")

    file_bytes = await file.read()

    file_id = fs.put(
        file_bytes,
        filename=file.filename,
        content_type="application/pdf",
        uploaded_at=datetime.utcnow(),
        uploaded_by=ObjectId(identity["user_id"])
    )

    cert = {
        "_id": ObjectId(),
        "title": title,
        "file_id": file_id,   # 🔑 STORED IN MONGODB
        "assigned_faculty_ids": [ObjectId(fid) for fid in assigned_faculty_ids],
        "status": "pending",
        "remarks": None,
        "submitted_at": datetime.utcnow(),
        "verified_by": None,
        "verified_at": None
    }

    result = await users_collection.update_one(
        {"_id": ObjectId(identity["user_id"])},
        {"$push": {"certifications": cert}}
    )

    print("MATCHED:", result.matched_count)
    print("MODIFIED:", result.modified_count)
    
    return {"message": "Certificate uploaded"}


@router.post("/internships/upload")
async def upload_internship(
    company: str = Form(...),
    role: str = Form(...),
    duration: str = Form(...),
    assigned_faculty_ids: List[str] = Form(...),
    file: UploadFile = File(...),
    identity=Depends(require_student)
):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF allowed")

    file_bytes = await file.read()

    file_id = fs.put(
        file_bytes,
        filename=file.filename,
        content_type="application/pdf",
        uploaded_at=datetime.utcnow(),
        uploaded_by=ObjectId(identity["user_id"])
    )

    internship = {
        "_id": ObjectId(),
        "company": company,
        "role": role,
        "duration": duration,
        "file_id": file_id,
        "assigned_faculty_ids": [ObjectId(fid) for fid in assigned_faculty_ids],
        "status": "pending",
        "submitted_at": datetime.utcnow(),
        "verified_by": None,
        "verified_at": None
    }

    await users_collection.update_one(
        {"_id": ObjectId(identity["user_id"])},
        {"$push": {"internships": internship}}
    )

    return {"message": "Internship uploaded"}





@router.get("/list")
async def list_certificates(identity=Depends(require_student)):
    student = await users_collection.find_one(
        {
            "_id": ObjectId(identity["user_id"]),
            "role": "student"
        },
        {"certifications": 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    certs = []

    for c in student.get("certifications", []):
        certs.append({
            "_id": str(c["_id"]),
            "title": c.get("title"),
            "status": c.get("status"),
            "remarks": c.get("remarks"),
            "file_id": str(c.get("file_id")) if c.get("file_id") else None,
            "submitted_at": c.get("submitted_at"),
        })

    return certs



@router.get("/internships")
async def list_internships(identity=Depends(require_student)):
    student = await users_collection.find_one(
        {
            "_id": ObjectId(identity["user_id"]),
            "role": "student"
        },
        {"internships": 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    internships = []

    for i in student.get("internships", []):
        internships.append({
            "_id": str(i["_id"]),
            "company": i.get("company"),
            "role": i.get("role"),
            "duration": i.get("duration"),
            "status": i.get("status"),
            "remarks": i.get("remarks"),
            "file_id": str(i.get("file_id")) if i.get("file_id") else None,
            "submitted_at": i.get("submitted_at"),
        })

    return internships


@router.post("/internships/upload")
async def upload_internship(
    company: str = Form(...),
    role: str = Form(...),
    duration: str = Form(...),
    assigned_faculty_ids: List[str] = Form(...),
    file: UploadFile = File(...),
    identity=Depends(require_student)
):
    # 1️⃣ Validate file
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files allowed")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(400, "Empty file")

    # 2️⃣ Store PDF in GridFS
    file_id = fs.put(
        file_bytes,
        filename=file.filename,
        content_type="application/pdf",
        uploaded_at=datetime.utcnow(),
        uploaded_by=ObjectId(identity["user_id"])
    )

    # 3️⃣ Internship document
    internship = {
        "_id": ObjectId(),
        "company": company,
        "role": role,
        "duration": duration,
        "file_id": file_id,  # 🔑 GridFS reference
        "assigned_faculty_ids": [ObjectId(fid) for fid in assigned_faculty_ids],
        "status": "pending",
        "remarks": None,
        "submitted_at": datetime.utcnow(),
        "verified_by": None,
        "verified_at": None
    }

    # 4️⃣ Push into student document
    result = await users_collection.update_one(
        {
            "_id": ObjectId(identity["user_id"]),
            "role": "student"
        },
        {
            "$push": {"internships": internship}
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Student not found")

    return {
        "message": "Internship uploaded successfully",
        "internship_id": str(internship["_id"])
    }
    
    

from fastapi import Query

@router.get("/documents")
async def list_documents(
    doc_type: str = Query("all"),   # certificate | internship | all
    search: str = Query(None),
    identity=Depends(require_student)
):
    student = await users_collection.find_one(
        {"_id": ObjectId(identity["user_id"]), "role": "student"},
        {"certifications": 1, "internships": 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    results = []

    # ================= CERTIFICATES =================
    if doc_type in ["certificate", "all"]:
        for c in student.get("certifications", []):
            if c.get("status") == "approved":
                if search and search.lower() not in c.get("title", "").lower():
                    continue

                results.append({
                    "id": str(c["_id"]),
                    "type": "certificate",
                    "title": c.get("title"),
                    "status": c.get("status"),
                    "file_id": str(c.get("file_id")),
                    "submitted_at": c.get("submitted_at"),
                })

    # ================= INTERNSHIPS =================
    if doc_type in ["internship", "all"]:
        for i in student.get("internships", []):
            if i.get("status") == "approved":
                if search and search.lower() not in i.get("company", "").lower():
                    continue

                results.append({
                    "id": str(i["_id"]),
                    "type": "internship",
                    "title": i.get("company"),
                    "role": i.get("role"),
                    "status": i.get("status"),
                    "file_id": str(i.get("file_id")),
                    "submitted_at": i.get("submitted_at"),
                })

    return results


@router.delete("/documents/{doc_type}/{doc_id}")
async def delete_document(
    doc_type: str,   # certificate | internship
    doc_id: str,
    identity=Depends(require_student)
):
    student_id = ObjectId(identity["user_id"])

    if doc_type == "certificate":
        pull_query = {"certifications": {"_id": ObjectId(doc_id)}}
        array_name = "certifications"

    elif doc_type == "internship":
        pull_query = {"internships": {"_id": ObjectId(doc_id)}}
        array_name = "internships"

    else:
        raise HTTPException(400, "Invalid document type")

    student = await users_collection.find_one(
        {"_id": student_id},
        {array_name: 1}
    )

    if not student:
        raise HTTPException(404, "Student not found")

    doc = next(
        (d for d in student.get(array_name, []) if d["_id"] == ObjectId(doc_id)),
        None
    )

    if not doc:
        raise HTTPException(404, "Document not found")

    # 🗑 delete file from GridFS
    if doc.get("file_id"):
        fs.delete(doc["file_id"])

    # 🧹 remove document metadata
    await users_collection.update_one(
        {"_id": student_id},
        {"$pull": pull_query}
    )

    return {"message": "Document deleted successfully"}
