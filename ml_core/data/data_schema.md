# Data Schema Design (Privacy Safe)

The core principle of this schema is **Data Minimization & Localization**. Raw telemetry and scores remain fully local to the Student's device. Only anonymous insights and aggregated weight updates from FL models are communicated externally.

## 1. Local Student Profile Schema (Remains 100% on Client)
This dataset trains the local predictive PyTorch models. It is stored natively in a secure SQLite or local key-value store.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "student_id": { "type": "string" },
    "academic_metrics": {
      "type": "object",
      "properties": {
        "cgpa": { "type": "number", "minimum": 0, "maximum": 10 },
        "attendance_percentage": { "type": "number", "minimum": 0, "maximum": 100 },
        "subject_scores": {
          "type": "array",
          "items": { "type": "object", "properties": { "subject": {"type": "string"}, "score": {"type": "number"} } }
        }
      }
    },
    "behavioral_metrics": {
      "type": "object",
      "properties": {
        "study_hours_per_week": { "type": "number" },
        "assignments_completed": { "type": "integer" }
      }
    },
    "placement_metrics": {
      "type": "object",
      "properties": {
        "coding_score": { "type": "number", "minimum": 0, "maximum": 100 },
        "aptitude_score": { "type": "number", "minimum": 0, "maximum": 100 },
        "communication_score": { "type": "number", "minimum": 0, "maximum": 100 },
        "mock_interview_score": { "type": "number", "minimum": 0, "maximum": 100 },
        "skill_tags": { "type": "array", "items": { "type": "string" } }
      }
    }
  },
  "required": ["student_id", "academic_metrics", "placement_metrics"]
}
```

## 2. Server Shared Schema / Weight Exchange
Instead of data, the server only receives encrypted model weights and noisy performance gradients.

```json
{
  "client_id": "anonymized_uuid_123",
  "round_number": 14,
  "encrypted_weights": "base64_encoded_tensor_bytes...",
  "masking_key": "part_of_secure_aggregation...",
  "num_training_samples": 450
}
```

## 3. Admin Insight Request Schema
What the admin portal receives from the backend:

```json
{
  "cohort_readiness_distribution": {
    "high_readiness": 45,
    "medium_readiness": 30,
    "low_readiness": 25
  },
  "skill_gap_trends": {
    "React": -12,
    "Data Structures": 5,
    "System Design": 20
  }
}
```
*Note: Numbers represent delta percentages or population sizes, untraceable to individual students.*
