import torch
import torch.nn as nn
import torch.nn.functional as F

class AcademicPredictorModel(nn.Module):
    """
    Model 1: Academic Performance Predictor (Classification - 3 classes)
    Inputs: Subject scores (normalized), Attendance %, Study hours
    Outputs: Risk Category (0: Low, 1: Medium, 2: High)
    """
    
    def __init__(self, input_dim: int = 3, hidden_dim: int = 16, num_classes: int = 3):
        super(AcademicPredictorModel, self).__init__()
        # Fully Connected Layers
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.dropout = nn.Dropout(0.2)
        self.fc2 = nn.Linear(hidden_dim, hidden_dim * 2)
        self.fc3 = nn.Linear(hidden_dim * 2, num_classes)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Forward pass"""
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x) 
        # Outputting logits. Will use nn.CrossEntropyLoss during training.
        return x

def get_academic_model() -> nn.Module:
    """Helper for FL framework to load models."""
    return AcademicPredictorModel()

if __name__ == '__main__':
    model = get_academic_model()
    dummy_input = torch.randn(5, 3) 
    out = model(dummy_input)
    print(f"Output shape (Batch Size, Classes): {out.shape}")
