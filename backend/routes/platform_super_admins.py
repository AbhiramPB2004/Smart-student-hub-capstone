from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime, timedelta
from bson import ObjectId
from schemas.platform_super_admins import SuperAdminRequest
from db.collections import super_admins_collection
from db.collections import super_admin_requests_collection
from schemas.super_admin_schema import (
    CreateSuperAdminRequest,
    UniversityVerificationRequest
)
from core.guards import require_platform_admin, require_super_admin
from services.token_service import generate_reset_token
from services.email_service import send_email
from services.email_templates import build_password_email
from typing import Optional

router = APIRouter(
    prefix="/platform/super-admins",
    tags=["Platform – Super Admins"]
)

@router.post("")
async def create_super_admin(
    data: CreateSuperAdminRequest,
    user=Depends(require_platform_admin)
):
    existing = await super_admins_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(400, "Super admin already exists")

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    doc = {
        "name": data.name,
        "email": data.email,
        "role": "super_admin",

        "password": None,
        "is_active": False,
        "created_at": datetime.utcnow(),
        "last_login": None,

        "university": {
            "name": data.university_name
        },

        "verification": {
            "status": "pending",
            "submitted_at": None,
            "verified_at": None,
            "verified_by": None,
            "remarks": None
        },

        "onboarding": {
            "reset_token": reset_token,
            "reset_token_exp": expiry
        }
    }

    await super_admins_collection.insert_one(doc)

    await send_email(
        to_email=data.email,
        subject="Set up your University Admin account",
        html=build_password_email(data.name, reset_token)
    )

    return {"message": "Super admin created and email sent"}


@router.get("")
async def list_super_admins(
    status: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    university: Optional[str] = Query(None),
    user=Depends(require_platform_admin)
):
    filters = {}

    if status:
        filters["verification.status"] = status

    if name:
        filters["name"] = {"$regex": name, "$options": "i"}

    if email:
        filters["email"] = {"$regex": email, "$options": "i"}

    if university:
        filters["university.name"] = {"$regex": university, "$options": "i"}

    admins = []
    async for doc in super_admins_collection.find(filters, {"password": 0}):
        doc["_id"] = str(doc["_id"])
        admins.append(doc)

    return admins



@router.get("")
async def list_super_admins(
    status: Optional[str] = Query(None),
    user=Depends(require_platform_admin)
):
    filters = {}
    if status:
        filters["verification.status"] = status

    admins = []
    async for doc in super_admins_collection.find(filters, {"password": 0}):
        doc["_id"] = str(doc["_id"])
        admins.append(doc)

    return admins



@router.patch("/{admin_id}/status")
async def update_super_admin_status(
    admin_id: str,
    is_active: bool,
    user=Depends(require_platform_admin)
):
    await super_admins_collection.update_one(
        {"_id": ObjectId(admin_id)},
        {"$set": {"is_active": is_active}}
    )

    return {"message": "Status updated"}

@router.post("/{admin_id}/reset-password")
async def reset_super_admin_password(
    admin_id: str,
    user=Depends(require_platform_admin)
):
    admin = await super_admins_collection.find_one(
        {"_id": ObjectId(admin_id)}
    )

    if not admin:
        raise HTTPException(404, "Super admin not found")

    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    await super_admins_collection.update_one(
        {"_id": ObjectId(admin_id)},
        {
            "$set": {
                "onboarding.reset_token": reset_token,
                "onboarding.reset_token_exp": expiry,
                "is_active": False
            }
        }
    )

    await send_email(
        admin["email"],
        "Reset your University Admin password",
        build_password_email(admin["name"], reset_token)
    )

    return {"message": "Password reset email sent"}


@router.post("/request")
async def request_super_admin(data: SuperAdminRequest):
    # Prevent duplicate requests
    existing = await super_admin_requests_collection.find_one({
        "email": data.email
    })
    if existing:
        raise HTTPException(400, "Request already submitted")

    await super_admin_requests_collection.insert_one({
        **data.dict(),
        "status": "pending",
        "created_at": datetime.utcnow()
    })

    return {
        "message": (
            "Request submitted successfully. "
            "You will receive an email once your institution is verified."
        )
    }




@router.post("/verification")
async def submit_university_verification(
    data: UniversityVerificationRequest,
    user=Depends(require_super_admin)
):
    await super_admins_collection.update_one(
        {"_id": ObjectId(user["user_id"])},
        {
            "$set": {
                "university": data.dict(),
                "verification.status": "pending",
                "verification.submitted_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Verification submitted"}

@router.get("/requests")
async def list_super_admin_requests(
    status: Optional[str] = Query("pending"),
    user=Depends(require_platform_admin)
):
    filters = {}
    if status:
        filters["status"] = status

    requests = []
    async for doc in super_admin_requests_collection.find(filters):
        doc["_id"] = str(doc["_id"])
        requests.append(doc)

    return requests

@router.post("/requests/{request_id}/approve")
async def approve_super_admin_request(
    request_id: str,
    user=Depends(require_platform_admin)
):
    req = await super_admin_requests_collection.find_one(
        {"_id": ObjectId(request_id)}
    )

    if not req:
        raise HTTPException(404, "Request not found")

    # Prevent double approval
    if req.get("status") != "pending":
        raise HTTPException(400, "Request already processed")

    # Create super admin
    reset_token = generate_reset_token()
    expiry = datetime.utcnow() + timedelta(hours=24)

    await super_admins_collection.insert_one({
        "name": req["name"],
        "email": req["email"],
        "role": "super_admin",

        "password": None,
        "is_active": False,
        "created_at": datetime.utcnow(),
        "last_login": None,

        "university": {
            "name": req["university_name"],
            "type": req["university_type"],
            "aishe_code": req["aishe_code"],
            "ugc_or_aicte_id": req["ugc_or_aicte_id"],
            "official_email_domain": req["official_email_domain"],
            "state": req["state"],
            "district": req["district"],
            "website": req.get("website"),
            "contact_phone": req.get("contact_phone"),
            "established_year": req.get("established_year")
        },

        "verification": {
            "status": "approved",
            "verified_at": datetime.utcnow(),
            "verified_by": user["user_id"],
            "remarks": None
        },

        "onboarding": {
            "reset_token": reset_token,
            "reset_token_exp": expiry,
            "email_verified": False
        }
    })

    # Mark request approved
    await super_admin_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": "approved"}}
    )

    # Send activation email
    await send_email(
        req["email"],
        "Activate your Super Admin account",
        build_password_email(req["name"], reset_token)
    )

    return {"message": "Super admin approved and email sent"}


@router.post("/requests/{request_id}/reject")
async def reject_super_admin_request(
    request_id: str,
    remarks: Optional[str] = Query(None),
    user=Depends(require_platform_admin)
):
    req = await super_admin_requests_collection.find_one(
        {"_id": ObjectId(request_id)}
    )

    if not req:
        raise HTTPException(404, "Request not found")

    await super_admin_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": "rejected",
                "rejected_at": datetime.utcnow(),
                "remarks": remarks
            }
        }
    )

    return {"message": "Request rejected"}
