from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

from auth import get_current_user
from role_middleware import require_role

app = FastAPI(title="EduShield AI - Smart Campus Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Endpoints
from auth import login_for_access_token
app.post("/login")(login_for_access_token)

# ----------------- STUDENT APIS -----------------

@app.get("/student/readiness-score")
def get_readiness_score(current_user: dict = Depends(require_role("student"))):
    """
    Returns the student's isolated local score based on the global FL model weights.
    In reality, the device calculates this locally, but this simulates the backend returning it
    if it was stored symmetrically for dashboard purposes.
    """
    return {
        "student_id": current_user["username"],
        "readiness_score": 75.4,
        "recent_prediction": "Ready for Placement (Tier 2)",
        "message": "This score was calculated entirely locally on your device using the FL global model."
    }

@app.get("/student/local-recommendations")
def get_local_recommendations(current_user: dict = Depends(require_role("student"))):
    """Returns local recommendations for weak subjects."""
    return {
        "recommendations": [
            {"subject": "Advanced Data Structures", "focus_area": "Graphs & DP"},
            {"subject": "System Design", "focus_area": "CAP Theorem"}
        ]
    }

# ----------------- ADMIN APIS -----------------

@app.get("/admin/aggregated-insights")
def get_aggregated_insights(current_user: dict = Depends(require_role("admin"))):
    """
    Returns population-level metrics securely aggregated from Flower FL Server.
    Individual PiI is never exposed.
    """
    return {
        "cohort_readiness": {
            "High": 45,
            "Medium": 30,
            "Low": 25
        },
        "trends": "Cohort readiness increased by 5% after FL Round 14",
        "message": "Aggregated from 100 students securely."
    }

@app.get("/admin/skill-gap-trends")
def get_skill_gap_trends(current_user: dict = Depends(require_role("admin"))):
    return {
        "skill_gaps": [
            {"skill": "React", "gap_percentage": 10},
            {"skill": "System Design", "gap_percentage": 40},
            {"skill": "Machine Learning", "gap_percentage": 25}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
