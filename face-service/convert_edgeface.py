"""Convert EdgeFace-XXS to ONNX format."""
import torch
from pathlib import Path

MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

print("Loading EdgeFace-XXS from torch.hub...")
model = torch.hub.load(
    'otroshi/edgeface',
    'edgeface_xxs',
    source='github',
    pretrained=True
)
model.eval()

# EdgeFace expects 112x112 RGB images, normalized
dummy_input = torch.randn(1, 3, 112, 112)

output_path = MODELS_DIR / "edgeface_xxs.onnx"

print(f"Exporting to ONNX: {output_path}")
torch.onnx.export(
    model,
    dummy_input,
    str(output_path),
    export_params=True,
    opset_version=17,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['embedding'],
    dynamic_axes={
        'input': {0: 'batch_size'},
        'embedding': {0: 'batch_size'}
    }
)

print(f"Done! Model saved to {output_path}")
print(f"File size: {output_path.stat().st_size / 1024 / 1024:.2f} MB")

# Quick test
import onnxruntime as ort
sess = ort.InferenceSession(str(output_path))
test_input = dummy_input.numpy()
result = sess.run(None, {'input': test_input})
print(f"Embedding shape: {result[0].shape}")
print(f"Embedding sample: {result[0][0][:5]}...")
