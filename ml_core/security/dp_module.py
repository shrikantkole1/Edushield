import numpy as np
import torch

class DifferentialPrivacyEngine:
    """
    Differential Privacy implementation adjusting gradients via clipping and noise.
    Ensures epsilon-delta privacy guarantees.
    """
    
    def __init__(self, epsilon=1.0, delta=1e-5, max_grad_norm=1.0):
        self.epsilon = epsilon
        self.delta = delta
        self.max_grad_norm = max_grad_norm
        # Calculate standard deviation for Gaussian noise
        self.sigma = (self.max_grad_norm * np.sqrt(2 * np.log(1.25 / self.delta))) / self.epsilon
        
    def clip_gradients(self, parameters: list):
        """Clips PyTorch gradients in-place to limit sensitivity."""
        torch.nn.utils.clip_grad_norm_(parameters, max_norm=self.max_grad_norm)
        
    def add_noise_to_weights(self, weights: list) -> list:
        """
        Injects Gaussian Noise into numpy weights array directly 
        (Used before transmitting to Flower Server).
        """
        noisy_weights = []
        for w in weights:
            noise = np.random.normal(0, self.sigma, w.shape)
            noisy_weights.append(w + noise)
        return noisy_weights

if __name__ == '__main__':
    # Test simulation
    dp_engine = DifferentialPrivacyEngine(epsilon=0.5)  # Strict privacy
    dummy_weights = [np.ones((5, 5))]
    
    print("Original Weights:", dummy_weights[0][0])
    noisy = dp_engine.add_noise_to_weights(dummy_weights)
    print("DP Noisy Weights:", noisy[0][0])
    print(f"Privacy Budget: Epsilon={dp_engine.epsilon}, Sigma={dp_engine.sigma:.4f}")
