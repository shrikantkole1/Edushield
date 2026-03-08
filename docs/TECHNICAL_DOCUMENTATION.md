# Technical Documentation & Algorithms (Packet 12)

## 1. Core Architecture Pattern
EduShield AI relies on a Hybrid Federated architecture:
- **FastAPI**: Acts as an application-level router responding to UI requests and serving authentication.
- **Flower (FLWR)**: Manages ML lifecycle and orchestrates the distributed RPC connections to PyTorch edge clients.

## 2. Federated Averaging (FedAvg) Algorithm
The global model $W_{t}$ at round $t$ is updated via:
$$ W_{t+1} = \sum_{k=1}^{K} \frac{n_k}{N} w_{t+1}^k $$
where $n_k$ is the number of samples in client $k$, $N$ is total samples, and $w_{t+1}^k$ represents the client's optimized local tensor.

## 3. Secure Aggregation Workflow
Using our Pairwise Additive Masking (Shamir's SS approximation):
- Server receives: $Y = \sum (W_k + M_k)$. 
- Because Masks $M$ sum to 0 symmetrically via seeded Diffie-Hellman keys, the server mathematically derives $\sum W_k$ without isolated vectors.

## 4. Literature Comparison (EDI Base reference)
| Feature | Traditional Campus ERP | EduShield AI (Ours) |
|---------|-----------------------|---------------------|
| ML Training Location | Centralized Server Cloud | Student Local Device (Edge) |
| Privacy Vector | Requires Full PII access | Differentially Private |
| Bandwidth Cost | High (sending database rows) | Low (sending only parameter deltas) |
| Readiness Analytics | Hardcoded SQL logic | Decentralized Deep Learning Model |
| Security against Hacks | 0% if server is breached | 100% (No data exists on server) |
