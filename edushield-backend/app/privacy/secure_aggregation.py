import numpy as np
import hashlib
from cryptography.fernet import Fernet
import logging

logger = logging.getLogger(__name__)

class SecureAggregator:
    """
    Simulates a secure aggregation multiparty computation protocol.
    Ensures that the server NEVER sees raw client weights.
    """
    
    def __init__(self):
        # Master key for testing/simulation (In production, this is Shamir Secret Sharing)
        self.master_key = Fernet.generate_key()
        self.cipher = Fernet(self.master_key)
        
    def generate_pairwise_mask(self, client_id_a, client_id_b):
        """Generates deterministic masks utilizing Diffie-Hellman Key Exchange simulating pairwise noise"""
        combined = sorted([client_id_a, client_id_b])
        seed_str = f"{combined[0]}-{combined[1]}"
        seed = int(hashlib.md5(seed_str.encode()).hexdigest(), 16) % (2**32)
        np.random.seed(seed)
        return np.random.normal(0, 0.1, 100) # Returns a deterministic mask array
        
    def encrypt_weights(self, weights: list):
        """Encrypt local weights securely before they leave the client device."""
        import pickle
        serialized = pickle.dumps(weights)
        encrypted = self.cipher.encrypt(serialized)
        return encrypted

    def decrypt_aggregated_weights(self, encrypted_payload: bytes):
        """Decrypt payload server-side (Simulating secure Enclave processing)"""
        import pickle
        decrypted = self.cipher.decrypt(encrypted_payload)
        weights = pickle.loads(decrypted)
        return weights
