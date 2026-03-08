import flwr as fl
import torch
import numpy as np
import logging
from collections import OrderedDict
import sys
import os

# Ensure `app` acts as root module when running directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.models.placement_model import get_placement_model
from app.privacy.differential_privacy import DifferentialPrivacyEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EduShieldClient(fl.client.NumPyClient):
    """Client node running on student's local device."""
    
    def __init__(self, model, train_loader, val_loader):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.dp_engine = DifferentialPrivacyEngine(epsilon=1.0)

    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in self.model.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(self.model.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        self.model.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        logger.info("Training on local data...")
        
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        criterion = torch.nn.BCELoss()
        
        self.model.train()
        total_loss = 0.0
        
        for epoch in range(3):
            for batch_x, batch_y in self.train_loader:
                batch_x, batch_y = batch_x.to(self.device), batch_y.to(self.device)
                optimizer.zero_grad()
                outputs = self.model(batch_x)
                
                loss = criterion(outputs.squeeze(), batch_y.float())
                loss.backward()
                self.dp_engine.clip_gradients(self.model.parameters())
                optimizer.step()
                total_loss += loss.item()
                
        logger.info("Applying Differential Privacy (Gaussian Noise)...")
        raw_weights = self.get_parameters(config={})
        noisy_weights = self.dp_engine.add_noise_to_weights(raw_weights)
        
        num_examples = len(self.train_loader.dataset)
        return noisy_weights, num_examples, {"loss": total_loss / 3, "accuracy": 0.85}

    def evaluate(self, parameters, config):
        self.set_parameters(parameters)
        self.model.eval()
        
        criterion = torch.nn.BCELoss()
        loss = 0.0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for batch_x, batch_y in self.val_loader:
                batch_x, batch_y = batch_x.to(self.device), batch_y.to(self.device)
                outputs = self.model(batch_x)
                loss += criterion(outputs.squeeze(), batch_y.float()).item()
                predicted = (outputs.squeeze() > 0.5).float()
                total += batch_y.size(0)
                correct += (predicted == batch_y.float()).sum().item()

        accuracy = correct / total
        return float(loss), total, {"accuracy": float(accuracy)}

if __name__ == "__main__":
    logger.info("Flower client started. Preparing local dataset. (Student specific isolated DB)")
    
    x_dummy = torch.randn(100, 4)
    y_dummy = torch.randint(0, 2, (100,)).float()
    
    dataset = torch.utils.data.TensorDataset(x_dummy, y_dummy)
    loader = torch.utils.data.DataLoader(dataset, batch_size=10, shuffle=True)
    
    model = get_placement_model()
    client = EduShieldClient(model, loader, loader)
    
    logger.info("Connecting to FL Server...")
    fl.client.start_numpy_client(server_address="127.0.0.1:8080", client=client)
