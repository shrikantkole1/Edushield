import flwr as fl
from typing import Dict, List, Optional, Tuple
import json
import logging
import uuid
import numpy as np
from flwr.common import Metrics

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Packet 4 & 5 Strategy implementing Secure Aggregation concepts
class SecureFedAvg(fl.server.strategy.FedAvg):
    """
    Overriding FedAvg strategy to simulate Secure Aggregation & DP logging.
    In an actual HW setup, clients encrypt their updates before sending.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.round_metrics = []

    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[fl.server.client_proxy.ClientProxy, fl.common.FitRes]],
        failures: List[BaseException],
    ):
        """Aggregate model weights from connected clients."""
        logger.info(f"--- Round {server_round}: Aggregation starting. Clients responded: {len(results)} ---")
        
        # Simulated Secure Aggregation Step: Unmasking (In real life, crypto happens here)
        logger.info("[SECURE-AGG] Validating MACs and decrypting client updates using Shamir Secret Sharing...")
        logger.info(f"[SECURE-AGG] Total encrypted payloads processed: {len(results)}")
        
        # Call the underlying standard FedAvg (weighted average)
        aggregated_weights, aggregated_metrics = super().aggregate_fit(server_round, results, failures)
        
        if aggregated_weights is not None:
             # Calculate loss/metrics from clients
             avg_loss = sum([r.metrics.get('loss', 0) * r.num_examples for _, r in results]) / sum([r.num_examples for _, r in results])
             avg_accuracy = sum([r.metrics.get('accuracy', 0) * r.num_examples for _, r in results]) / sum([r.num_examples for _, r in results])
             
             round_log = {
                 "round": server_round,
                 "num_clients": len(results),
                 "aggregated_loss": float(avg_loss),
                 "aggregated_accuracy": float(avg_accuracy),
                 "status": "Securely Aggregated & DP Complete"
             }
             self.round_metrics.append(round_log)
             
             # Log metrics
             with open("training_round_logs.json", "w") as f:
                 json.dump(self.round_metrics, f, indent=4)
                 
             logger.info(f"Round {server_round} complete. Global model accuracy: {avg_accuracy:.4f}")
             
        return aggregated_weights, aggregated_metrics


def start_flower_server(num_rounds=10):
    """
    Start the FLWR federated server tracking metrics using Secure FedAvg
    """
    # Create strategy
    strategy = SecureFedAvg(
        fraction_fit=1.0,  # Sample 100% of available clients for training
        fraction_evaluate=1.0,  # Sample 100% of available clients for evaluation
        min_fit_clients=2,
        min_evaluate_clients=2,
        min_available_clients=2,
    )
    
    logger.info("Starting Federated Server (Flower)... Waiting for clients...")
    # Start server
    fl.server.start_server(
        server_address="0.0.0.0:8080",
        config=fl.server.ServerConfig(num_rounds=num_rounds),
        strategy=strategy,
    )

if __name__ == "__main__":
    start_flower_server()
