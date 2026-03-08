# EduShield AI - Deployment Guide (Packet 14)

## Prerequisites
- Python 3.9+
- Node.js 16+
- PyTorch, Flower, FastAPI

## Local Setup Instructions

### 1. Initialize ML & Backend Environments 
```bash
cd backend_api
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run the Federated Server (Flower)
```bash
cd ml_core/federated
python fl_server.py
# Server starts on port 8080 and waits for clients.
```

### 3. Run Edge Clients (Simulated Devices)
In a new terminal:
```bash
source venv/bin/activate
cd ml_core/federated
python fl_client.py
# Simulates a student's edge machine. 
# You can run multiple instances of this to trigger the FL aggregation round.
```

### 4. Run the REST API Middleware
```bash
cd backend_api
uvicorn main:app --reload --port 8000
# Available at http://localhost:8000/docs
```

### 5. Start the React Dashboards
```bash
cd frontend
npm install
npm run dev
# Vite runs at http://localhost:5173
```

## Docker Deployment (Production Demo)
For the EDI Seminar Evaluation, you can wrap the entire setup:
```bash
docker-compose up --build
```
This spawns:
- Container 1: FL Server
- Container 2, 3: Simulated Edge Clients
- Container 4: FastAPI Router
- Container 5: Nginx + React
