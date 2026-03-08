# EduShield AI - Privacy Preserving Smart Campus System

Welcome to the central documentation and execution payload for **EduShield AI**.
This directory structure contains all the necessary deliverables required for the **Phase 1 to Phase 7** development and evaluation cycle of EduShield AI (Federated Learning + Edge AI).

## Directory Structure
- **`/docs`**: Contains all requested Master Plan Documentation (Packets 1, 5, 6, 10, 11, 12, 13, 14).
  - `architecture_design.md`
  - `encryption_flow_document.md`
  - `privacy_vs_accuracy_report.md`
  - `federated_simulation_testing.md`
  - `security_testing.md`
  - `TECHNICAL_DOCUMENTATION.md`
  - `EVALUATION_METRICS.md`
  - `DEPLOYMENT_GUIDE.md`
- **`/ml_core/data`**: Differential privacy synthetic datasets and preprocessing logic (Packet 2).
- **`/ml_core/models`**: PyTorch neural network files for Academic & Placement predictors (Packet 3).
- **`/ml_core/federated`**: Flower strategy server and simulated student edge clients (Packet 4).
- **`/ml_core/security`**: Simulated Shamir Secure Aggregation and Gaussian Noise DP engines (Packets 5 & 6).
- **`/backend_api`**: FastAPI routers equipped with Role-Based Access Control and JWT (Packet 7).

## Team Roles & Responsibilities
- **Shrikant**: Federated Learning (`ml_core/federated`) + Backend Security (`backend_api`)
- **Manan**: PyTorch ML Models (`ml_core/models`)
- **Sanskruti**: Differential Privacy (`ml_core/security/dp_module.py`)
- **Mansi**: Frontend Student Dashboard
- **Samarth**: Admin Dashboard + Testing & Docs (`/docs`)

## Getting Started
Please refer to `docs/DEPLOYMENT_GUIDE.md` for running the federated training simulation locally and booting up the FastAPI layer.

*This project structure provides the "High Level" research grade implementation required, explicitly demonstrating the transition from a Centralized Baseline Model to a Federated + Secure Aggregation + Differential Privacy architecture.*
