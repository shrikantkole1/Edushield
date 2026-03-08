# Tech Stack Justification - EduShield AI

## 1. Frontend: React
**Why React?**
- React's component-based architecture is ideal for building dynamic dashboards for both Students and Admins.
- Robust ecosystem (Recharts/Chart.js) allows for seamless data visualization needed to present the readiness scores and skill gap distributions dynamically without lag.

## 2. Backend API: FastAPI
**Why FastAPI?**
- Built on Starlette and Pydantic, enabling high-performance and asynchronous task execution, which is crucial when proxying requests between the frontend and the FL server.
- Built-in data validation and serialization make defining API schemas secure and typed out-of-the-box.

## 3. Federated Learning: Flower (FLWR)
**Why Flower?**
- Flexible, language-agnostic federated learning framework.
- It is designed to scale effortlessly, supporting everything from mobile clients to backend API nodes dynamically connecting and disconnecting.
- It seamlessly integrates with PyTorch and supports custom aggregation strategies (FedAvg, Secure Aggregation).

## 4. Machine Learning: PyTorch
**Why PyTorch?**
- Pythonic approach and dynamic computation graphs make writing complex models (Deep Neural Networks for Classification and Regression) and debugging straightforward.
- Easy to extract model weights as state dictionaries and serialize them for the FL and Secure Aggregation processes.

## 5. Security & Privacy Mechanisms
- **JWT (JSON Web Tokens)**: Used for robust stateless authentication and explicit role-based segregation (`student` vs `admin`).
- **Differential Privacy (DP)**: Adding specific Gaussian Noise to gradient updates ensures an adversary cannot reverse-engineer a single student's features.
- **Secure Aggregation Protocols**: A cryptographic layer applied before the weights leave the client so the central server never sees the raw, individual model updates.
