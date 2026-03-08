import torch
import torch.nn as nn
import torch.nn.functional as F

class PlacementReadinessModel(nn.Module):
    """
    Model 2: Placement Readiness Predictor (Binary Classification)
    Inputs: CGPA, Coding score, Aptitude score, Communication score
    Outputs: Readiness probability (Sigmoid output -> 1 = Ready, 0 = Not Ready)
    """
    
    def __init__(self, input_dim: int = 4, hidden_dim: int = 32):
        super(PlacementReadinessModel, self).__init__()
        
        self.layer1 = nn.Linear(input_dim, hidden_dim)
        self.batch_norm = nn.BatchNorm1d(hidden_dim)
        self.layer2 = nn.Linear(hidden_dim, hidden_dim // 2)
        self.output_layer = nn.Linear(hidden_dim // 2, 1)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.layer1(x)
        if x.shape[0] > 1:
            x = self.batch_norm(x)
        x = F.relu(x)
        
        x = F.relu(self.layer2(x))
        x = torch.sigmoid(self.output_layer(x))
        return x

def get_placement_model() -> nn.Module:
    """Helper method required by the Flower Server/Client"""
    return PlacementReadinessModel()

if __name__ == '__main__':
    model = get_placement_model()
    dummy_input = torch.randn(5, 4)
    y_pred = model(dummy_input)
    print(f"Placement prediction probabilities:\n{y_pred}")
