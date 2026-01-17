from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.predefined_plan import (
    CreatePlanRequest,
    CreatePlanResponse,
    GetPlanResponse,
    UpdatePlanRequest
)
from services.predefined_service.predefined_service import PredefinedPlanService
from db.config import db

# Create router
router = APIRouter(prefix="/api/ai", tags=["AI Study Plans"])

# Dependency to get database
async def get_database():
    return db.database

@router.post(
    "/predefined-study-plan",
    response_model=CreatePlanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new predefined study plan",
    description="Create a new 30-day study plan for a specific subject. Total days are automatically calculated from the schedule length."
)
async def create_predefined_plan(
    plan: CreatePlanRequest,
    database = Depends(get_database)
):
    """
    Create a new predefined study plan.
    
    - **subject**: Name of the subject (required)
    - **schedule**: Array of days with topics and subtopics
    
    The totalDays field is automatically calculated from the schedule length.
    """
    try:
        plan_data = plan.dict()
        return await PredefinedPlanService.create_predefined_plan(plan_data, database)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )

@router.get(
    "/predefined-study-plan/{subject}",
    response_model=GetPlanResponse,
    summary="Get a predefined study plan by subject",
    description="Retrieve a study plan for a specific subject (case-insensitive search)"
)
async def get_predefined_plan(
    subject: str,
    database = Depends(get_database)
):
    """
    Get a predefined study plan by subject name.
    
    - **subject**: Name of the subject to search for
    
    Returns the complete study plan including schedule, topics, and subtopics.
    """
    try:
        return await PredefinedPlanService.get_predefined_plan(subject, database)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )

@router.get(
    "/predefined-study-plans",
    response_model=List[GetPlanResponse],
    summary="Get all predefined study plans",
    description="Retrieve all study plans with pagination"
)
async def get_all_predefined_plans(
    skip: int = 0,
    limit: int = 100,
    database = Depends(get_database)
):
    """
    Get all predefined study plans.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    
    Returns a list of all available study plans.
    """
    try:
        return await PredefinedPlanService.get_all_predefined_plans(skip, limit, database)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )

@router.put(
    "/predefined-study-plan/{subject}",
    response_model=dict,
    summary="Update a predefined study plan",
    description="Update an existing study plan for a specific subject"
)
async def update_predefined_plan(
    subject: str,
    plan_update: UpdatePlanRequest,
    database = Depends(get_database)
):
    """
    Update a predefined study plan.
    
    - **subject**: Name of the subject to update
    - **schedule**: Updated schedule (optional)
    
    Returns a success message upon successful update.
    """
    try:
        update_data = plan_update.dict(exclude_unset=True)
        return await PredefinedPlanService.update_predefined_plan(subject, update_data, database)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )

@router.delete(
    "/predefined-study-plan/{subject}",
    response_model=dict,
    summary="Delete a predefined study plan",
    description="Delete a study plan for a specific subject"
)
async def delete_predefined_plan(
    subject: str,
    database = Depends(get_database)
):
    """
    Delete a predefined study plan.
    
    - **subject**: Name of the subject to delete
    
    Returns a success message upon successful deletion.
    """
    try:
        return await PredefinedPlanService.delete_predefined_plan(subject, database)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )