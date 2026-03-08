import torch
import torch.nn as nn
import numpy as np
import sys
import os
import logging
import json
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.models.placement_model import get_placement_model
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def evaluate_model(model, loader, criterion, device):
    """Evaluates the model on the given dataset loader."""
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0
    with torch.no_grad():
        for batch_x, batch_y in loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            outputs = model(batch_x)
            loss = criterion(outputs.squeeze(), batch_y.float())
            total_loss += loss.item()
            predicted = (outputs.squeeze() > 0.5).float()
            total += batch_y.size(0)
            correct += (predicted == batch_y.float()).sum().item()
            
    return total_loss / len(loader), correct / total

def train_centralized_model():
    """
    Trains a model centrally to act as the performance baseline.
    Represents the scenario where all data is pooled (No Privacy).
    """
    logger.info("Starting Centralized Baseline Training...")
    start_time = time.time()
    
    # 1. Generate a pooled dummy dataset representing total campus data
    # (In reality, this merges all individual student datasets)
    total_samples = 1000  # E.g., 10 clients * 100 samples
    x_pooled = torch.randn(total_samples, 4)
    y_pooled = torch.randint(0, 2, (total_samples,)).float()
    
    # Split 80/20 train/test
    split = int(0.8 * total_samples)
    train_dataset = torch.utils.data.TensorDataset(x_pooled[:split], y_pooled[:split])
    test_dataset = torch.utils.data.TensorDataset(x_pooled[split:], y_pooled[split:])
    
    train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=settings.BATCH_SIZE, shuffle=True)
    test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=settings.BATCH_SIZE, shuffle=False)
    
    # 2. Setup Model & Training constraints
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = get_placement_model().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=settings.LEARNING_RATE)
    criterion = nn.BCELoss()
    
    # Train for equivalent epochs (FL typically reaches convergence slower, centralized handles it efficiently)
    epochs = 30 
    
    metrics_log = []
    
    for epoch in range(1, epochs + 1):
        model.train()
        epoch_loss = 0.0
        
        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs.squeeze(), batch_y.float())
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
            
        test_loss, test_acc = evaluate_model(model, test_loader, criterion, device)
        
        if epoch % 5 == 0 or epoch == epochs:
            logger.info(f"Epoch {epoch}/{epochs} - Loss: {epoch_loss/len(train_loader):.4f} - Val Acc: {test_acc:.4f}")
            
        metrics_log.append({
            "epoch": epoch,
            "train_loss": epoch_loss / len(train_loader),
            "val_loss": test_loss,
            "val_accuracy": test_acc
        })
        
    execution_time = time.time() - start_time
    logger.info(f"Centralized Training Completed in {execution_time:.2f} seconds. Final Accuracy: {test_acc:.4f}")
    
    # Save metrics for comparison against Federated & DP-Federated
    log_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    with open(os.path.join(log_dir, "centralized_baseline_metrics.json"), "w") as f:
        json.dump(metrics_log, f, indent=4)

if __name__ == "__main__":
    train_centralized_model()
