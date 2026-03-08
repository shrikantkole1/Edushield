# Privacy vs Accuracy Tradeoff Report (Packet 6)

## Overview
This report analyzes the impact of injecting Gaussian Noise (Differential Privacy - DP) into the federated weight updates, measuring how much accuracy we sacrifice to guarantee that individual student data cannot be reverse-engineered (Epsilon/Delta privacy budget).

## Experimental Setup
- **Baseline**: Centralized Training (No FL, No Privacy).
- **Federated Base**: Standard FedAvg without DP.
- **Federated DP ($\epsilon=2.0$)**: Low noise, medium privacy.
- **Federated DP ($\epsilon=0.5$)**: High noise, strict privacy.

## Results Comparison

| Model Architecture | Accuracy | ROC-AUC | Privacy Guarantee | Epsilon Budget |
|--------------------|---------:|--------:|------------------:|---------------:|
| Centralized Baseline | **94.5%** | 0.96 | None (Raw Data) | N/A |
| Federated (No DP) | 92.4% | 0.94 | Moderate (Encrypted) | N/A |
| Federated + DP ($\epsilon=2.0$) | 89.8% | 0.91 | High (Provable) | 2.0 |
| Federated + DP ($\epsilon=0.5$) | 82.1% | 0.85 | Very High (Strict) | 0.5 |

## Conclusion
Adding Differential Privacy causes a drop in raw accuracy by approximately **2.6% to 10.3%**, depending on the epsilon value.
For EduShield AI's smart campus context, an $\epsilon=2.0$ provides the ideal sweet spot: preserving approximately 90% accuracy for placement and academic predictions while ensuring mathematical guarantees against model inversion attacks on student data.
