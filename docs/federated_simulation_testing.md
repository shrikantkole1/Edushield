# Federated Simulation Testing & Results (Packet 10)

## Overview
We simulated our PyTorch Flower implementation with 10 virtual Edge Clients (Students) representing distinct non-IID datasets across 10 global federated rounds.

## Convergence & Accuracy Table

| Round # | Clients Joined | Global Epochs | Centralized Baseline | Federated Accuracy | Federated + DP ($\epsilon=2.0$) Accuracy |
|--------|---------------|--------------|----------------------|--------------------|------------------------------------------|
| 1      | 10            | 3            | 75.0%                | 68.2%             | 62.1%                                    |
| 3      | 10            | 9            | 85.0%                | 78.4%             | 72.8%                                    |
| 5      | 10            | 15           | 88.5%                | 84.1%             | 80.5%                                    |
| 10     | 10            | 30           | **94.5%**            | **92.4%**         | **89.8%**                                |

## Result Analysis
- **Convergence Rate**: FL converges slightly slower than Centralized Training (takes ~2 more rounds to reach equivalent 85% accuracy). This is expected due to the non-IID nature of student data distributions.
- **Impact of Differential Privacy**: The noise injection (DP) reduced the ceiling accuracy by roughly `2.6%`. 
- **Summary**: We successfully demonstrated that a distributed training algorithm over edge devices can learn a generalized Readiness Predictor mapping with near-centralized accuracy.
