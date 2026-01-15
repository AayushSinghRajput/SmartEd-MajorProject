from typing import List
from datetime import datetime
import re
from fastapi import HTTPException, status
from models.predefined_plan import (
    CreatePlanResponse,
    GetPlanResponse
)

class PredefinedPlanService:
    """Service class containing business logic - equivalent to Express controllers"""
    
    @staticmethod
    async def create_predefined_plan(plan_data: dict, db) -> CreatePlanResponse:
        """
        Create a new predefined study plan
        Equivalent to Express: CreatePredefinedStudyPlan controller
        """
        try:
            # Calculate totalDays from schedule
            if plan_data.get("schedule") and isinstance(plan_data["schedule"], list):
                plan_data["totalDays"] = len(plan_data["schedule"])
            
            # Check for existing plan (case-insensitive) - prevents duplicates
            existing_plan = await db.predefined_plans.find_one({
                "subject": {"$regex": f"^{re.escape(plan_data['subject'])}$", "$options": "i"}
            })
            
            if existing_plan:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Plan for subject '{plan_data['subject']}' already exists"
                )
            
            # Add timestamps
            plan_data["created_at"] = datetime.utcnow()
            plan_data["updated_at"] = datetime.utcnow()
            
            # Insert into database
            result = await db.predefined_plans.insert_one(plan_data)
            
            if result.inserted_id:
                return CreatePlanResponse(
                    message="Plan saved successfully!",
                    totalDaysSaved=plan_data.get("totalDays", 0)
                )
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save plan"
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating plan: {str(e)}"
            )

    @staticmethod
    async def get_predefined_plan(subject: str, db) -> GetPlanResponse:
        """
        Get a predefined study plan by subject (case-insensitive)
        Equivalent to Express: GetPredefinedStudyPlan controller
        """
        try:
            # Case-insensitive search using regex
            plan = await db.predefined_plans.find_one({
                "subject": {"$regex": f"^{re.escape(subject)}$", "$options": "i"}
            })
            
            if not plan:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Plan not found"
                )
            
            # Return as response model
            return GetPlanResponse(
                subject=plan["subject"],
                totalDays=plan.get("totalDays", 0),
                schedule=plan.get("schedule", [])
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching plan: {str(e)}"
            )

    @staticmethod
    async def get_all_predefined_plans(skip: int = 0, limit: int = 100, db=None) -> List[GetPlanResponse]:
        """
        Get all predefined study plans with pagination
        """
        try:
            cursor = db.predefined_plans.find().skip(skip).limit(limit)
            plans = await cursor.to_list(length=limit)
            
            # Convert to response models
            response_plans = []
            for plan in plans:
                response_plans.append(
                    GetPlanResponse(
                        subject=plan["subject"],
                        totalDays=plan.get("totalDays", 0),
                        schedule=plan.get("schedule", [])
                    )
                )
            
            return response_plans
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching plans: {str(e)}"
            )

    @staticmethod
    async def update_predefined_plan(subject: str, update_data: dict, db) -> dict:
        """
        Update a predefined study plan
        """
        try:
            # Find existing plan first
            existing_plan = await db.predefined_plans.find_one({
                "subject": {"$regex": f"^{re.escape(subject)}$", "$options": "i"}
            })
            
            if not existing_plan:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Plan not found"
                )
            
            # Update totalDays if schedule is being updated
            if "schedule" in update_data and isinstance(update_data["schedule"], list):
                update_data["totalDays"] = len(update_data["schedule"])
            
            update_data["updated_at"] = datetime.utcnow()
            
            # Perform update
            result = await db.predefined_plans.update_one(
                {"_id": existing_plan["_id"]},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return {"message": "Plan updated successfully!"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No changes were made to the plan"
                )
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating plan: {str(e)}"
            )

    @staticmethod
    async def delete_predefined_plan(subject: str, db) -> dict:
        """
        Delete a predefined study plan
        """
        try:
            result = await db.predefined_plans.delete_one({
                "subject": {"$regex": f"^{re.escape(subject)}$", "$options": "i"}
            })
            
            if result.deleted_count > 0:
                return {"message": "Plan deleted successfully!"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Plan not found"
                )
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting plan: {str(e)}"
            )