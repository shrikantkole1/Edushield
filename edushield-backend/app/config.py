from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "EduShield AI Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-for-edushield-jwt"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Federated Learning Settings
    FL_SERVER_ADDRESS: str = "0.0.0.0:8080"
    NUM_FL_ROUNDS: int = 10
    FRACTION_FIT: float = 1.0
    FRACTION_EVALUATE: float = 1.0
    MIN_FIT_CLIENTS: int = 2
    MIN_AVAILABLE_CLIENTS: int = 2
    
    # Differential Privacy Settings
    DP_EPSILON: float = 1.0
    DP_DELTA: float = 1e-5
    DP_MAX_GRAD_NORM: float = 1.0
    
    # Model Configurations
    PLACMENT_MODEL_HIDDEN_DIM: int = 32
    ACADEMIC_MODEL_HIDDEN_DIM: int = 16
    LOCAL_EPOCHS: int = 3
    LEARNING_RATE: float = 0.001
    BATCH_SIZE: int = 10

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
