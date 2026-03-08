import flwr as fl
import logging
from app.federated.strategy import SecureFedAvg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_flower_server(num_rounds=10):
    """
    Start the FLWR federated server tracking metrics using Secure FedAvg
    """
    strategy = SecureFedAvg(
        fraction_fit=1.0,  
        fraction_evaluate=1.0,  
        min_fit_clients=2,
        min_evaluate_clients=2,
        min_available_clients=2,
    )
    
    logger.info("Starting Federated Server (Flower)... Waiting for clients...")
    fl.server.start_server(
        server_address="0.0.0.0:8080",
        config=fl.server.ServerConfig(num_rounds=num_rounds),
        strategy=strategy,
    )

if __name__ == "__main__":
    start_flower_server()
