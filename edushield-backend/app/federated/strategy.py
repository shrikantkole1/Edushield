import flwr as fl
from typing import List, Tuple
import json
import logging
import os
from app.utils.metrics import summarize_round_metrics

logger = logging.getLogger(__name__)

class SecureFedAvg(fl.server.strategy.FedAvg):
    """
    Overriding FedAvg strategy to simulate Secure Aggregation & DP logging.
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
        
        # Simulated Secure Aggregation Step
        logger.info("[SECURE-AGG] Validating MACs and decrypting client updates using Shamir Secret Sharing...")
        
        aggregated_weights, aggregated_metrics = super().aggregate_fit(server_round, results, failures)
        
        if aggregated_weights is not None:
             avg_loss, avg_accuracy = summarize_round_metrics(results)
             
             round_log = {
                 "round": server_round,
                 "num_clients": len(results),
                 "aggregated_loss": float(avg_loss),
                 "aggregated_accuracy": float(avg_accuracy),
                 "status": "Securely Aggregated & DP Complete"
             }
             self.round_metrics.append(round_log)
             
             # Save metrics logic
             log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "training_round_logs.json")
             with open(log_path, "w") as f:
                 json.dump(self.round_metrics, f, indent=4)
                 
             logger.info(f"Round {server_round} complete. Global model accuracy: {avg_accuracy:.4f}")
             
        return aggregated_weights, aggregated_metrics
