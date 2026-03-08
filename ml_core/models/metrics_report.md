# Simulated Metrics Report (Packet 3)

## 1. Academic Performance Predictor Metrics
This report evaluates the PyTorch Multiclass Model (Low, Medium, High Risk).

**Model Performance**:
- **Accuracy**: 92.4%
- **Macro F1-Score**: 0.91
- **ROC-AUC (Ovr)**: 0.96

### Confusion Matrix (Test Set N=100)
| True \ Pred | Low (0) | Medium (1) | High (2) |
|-------------|--------:|-----------:|---------:|
| **Low**     |      45 |          2 |        0 |
| **Medium**  |       3 |         30 |        3 |
| **High**    |       0 |          2 |       15 |

## 2. Placement Readiness Predictor
Evaluates the PyTorch Binary Classification model.

**Model Performance**:
- **Accuracy**: 89.1%
- **Precision**: 0.88
- **Recall**: 0.90
- **F1-Score**: 0.89
- **ROC-AUC**: 0.94

---
*Note: A Jupyter notebook equivalent of this runs the PyTorch eval loops manually over synthetic data generating matplotlib graphs.*
