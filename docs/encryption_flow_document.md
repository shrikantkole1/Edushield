# Secure Aggregation & Encryption Flow Document (Packet 5)

## 1. Problem Statement
In standard Federated Learning, clients send raw gradient updates to the central server. However, an adversary monitoring the central server could perform a **Model Inversion Attack** or **Data Inference Attack** to reconstruct a student's private marks, behavior, or coding scores based on their specific weight updates.

## 2. Our Cryptographic Solution
EduShield AI implements **Secure Aggregation** based on Shamir's Secret Sharing and Pairwise Masking.

### Step-by-Step Encryption Flow
1. **Key Exchange**: Each Student Client performs a Diffie-Hellman Key Exchange with other available clients in the cohort round to establish shared secrets.
2. **Mask Generation**: A PRG (Pseudorandom Generator) expands the shared secrets into noise tensors mirroring the shape of the PyTorch model weights.
3. **Additive Masking**: Client A adds the mask to its weights (`W + M`). The corresponding Client B subtracts the same mask (`W - M`).
4. **Transmission**: The masked weights are serialized and transmitted via HTTPS to the Flower FastAPI server.
5. **Secure Aggregation**: The Flower server sums all weights. 
   - `Sum = (W_A + M) + (W_B - M) = W_A + W_B`
   - The masks naturally cancel out. The Server computes the average **WITHOUT** ever seeing the raw individual weights of `W_A` or `W_B`.

## 3. Implementation Reality
In this project, the `secure_aggregation.py` module demonstrates this workflow via `Fernet` symmetric encryption and deterministic `numpy` PRG seeds to simulate the masking overhead before the PyTorch tensors hit the Flower `FedAvg` strategy algorithm.
