from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, admin
from app.api.auth import require_role

app = FastAPI(title="EduShield AI - Smart Campus Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount sub-routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/admin", tags=["Admin Insights"])

# ----------------- STUDENT APIS -----------------

@app.get("/student/readiness-score", tags=["Student"])
def get_readiness_score(current_user: dict = Depends(require_role("student"))):
    """
    Returns the student's isolated local score based on the global FL model weights.
    In reality, the device calculates this locally, but this simulates the backend returning it.
    """
    return {
        "student_id": current_user["username"],
        "readiness_score": 75.4,
        "recent_prediction": "Ready for Placement (Tier 2)",
        "message": "This score was calculated entirely locally on your device using the FL global model."
    }

@app.get("/student/local-recommendations", tags=["Student"])
def get_local_recommendations(current_user: dict = Depends(require_role("student"))):
    """Returns local recommendations for weak subjects."""
    return {
        "recommendations": [
            {"subject": "Advanced Data Structures", "focus_area": "Graphs & DP"},
            {"subject": "System Design", "focus_area": "CAP Theorem"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Execute with: uvicorn app.main:app --reload
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
