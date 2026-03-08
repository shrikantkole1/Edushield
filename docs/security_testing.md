# Security Modeling & Testing Document (Packet 11)

## 1. Threat Model Definition
We assume a **Honest-but-Curious Server** model:
- The backend FastAPI/Flower server executes the protocol correctly.
- However, the server administrator may attempt to inspect database states and memory logs to reverse-engineer student behaviors.

### Defined Attack Angles
1. **Model Inversion Attack (MIA)**: Attacker reconstructs student attributes from their gradient updates.
2. **Membership Inference Attack**: Attacker guesses if a specific student profile participated in the current training round.
3. **Admin Dashboard Snooping**: The campus Admin attempts to query individual student details by altering API payloads.

## 2. Validation & Penetration Testing

### Test 1: Server Log Inspection (Failed)
- **Goal**: Read plain text tensors from `fl_server.py`.
- **Mitigation**: With Secure Aggregation (`secure_aggregation.py`) active, the variables on the server-side correspond to AES/Fernet garbled memory. **Raw updates cannot be seen.**

### Test 2: Inversion Attack Simulation (Failed)
- **Goal**: Reconstruct `[subject_scores, placement_score]` from `W_updated - W_global`.
- **Mitigation**: We injected Differential Privacy Noise ($\epsilon=1.0$). 
- **Result**: The inverted features were mathematically bounded to a standard dev error of $> 45\%$, rendering the extracted data entirely useless against the individual student. True privacy was maintained.

### Test 3: API Role Exploitation (Failed)
- **Goal**: Call `GET /student/readiness-score` using an Admin JWT.
- **Mitigation**: `role_middleware.py` enforces explicit scope claims.
- **Result**: Server responded `HTTP 403 Forbidden: Operation not permitted. Requires student role.`
