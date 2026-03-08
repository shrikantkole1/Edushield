import logging

logger = logging.getLogger(__name__)

def calculate_accuracy(predictions, labels):
    """Calculate accuracy from predictions and labels."""
    correct = (predictions == labels).sum().item()
    total = labels.size(0)
    return correct / total if total > 0 else 0.0

def summarize_round_metrics(results):
    """Aggregate common metrics returned by clients."""
    if not results:
        return 0.0, 0.0
    
    avg_loss = sum([r.metrics.get('loss', 0) * r.num_examples for _, r in results]) / sum([r.num_examples for _, r in results])
    avg_acc = sum([r.metrics.get('accuracy', 0) * r.num_examples for _, r in results]) / sum([r.num_examples for _, r in results])
    return avg_loss, avg_acc
