import os
import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms
from ultralytics import YOLO
import cv2
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pickle

# Initialize YOLO model
yolo_model = YOLO('models/yolo-model/best.pt')  # Update with your YOLO model path

# Initialize Gender Classification Model
class GenderClassificationModel(nn.Module):
    def __init__(self):
        super(GenderClassificationModel, self).__init__()
        self.model = models.resnet50(pretrained=True)
        for param in self.model.parameters():
            param.requires_grad = False  # Freeze the layers
        num_features = self.model.fc.in_features
        self.model.fc = nn.Linear(num_features, 2)

    def forward(self, x):
        return self.model(x)

gender_model = GenderClassificationModel()
state_dict = torch.load('models/gender_classification_model/gender_classification_model.pth')
gender_model.load_state_dict(state_dict)
gender_model.eval()

# Initialize ResNet50 model for embeddings
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.layers import GlobalAveragePooling2D
from tensorflow.keras.models import Model

base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
x = base_model.output
x = GlobalAveragePooling2D()(x)
embedding_model = Model(inputs=base_model.input, outputs=x)

# Load precomputed embeddings and DataFrame
with open('models/image-embeddings/embeddings-new.pkl', 'rb') as f:
    embeddings = pickle.load(f)
df = pd.read_csv('models/image-embeddings/dataset_with_embeddings-new.csv')

# Define data transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def generate_bbox(img_path, conf_thres=0.3):
    results = yolo_model(img_path, conf=conf_thres)
    output = []
    for result in results[0].boxes:
        cls = result.cls.item()
        score = result.conf.item()
        bbox = result.xyxy[0].cpu().numpy().astype(int)
        class_name = yolo_model.names[int(cls)]
        output.append((class_name, score, bbox))
    return output

def extract_clothes(img_path: str):
    try:
        image = Image.open(img_path).convert('RGB')
        image_np = np.array(image)
    except Exception as e:
        print(f"Error opening image: {e}")
        return {}

    results = generate_bbox(img_path, conf_thres=0.3)
    outputs = {"original_image": image_np}
    for result in results:
        class_name, score, bbox = result
        XMIN, YMIN, XMAX, YMAX = bbox
        XMIN, YMIN = max(0, XMIN), max(0, YMIN)
        XMAX, YMAX = min(image_np.shape[1], XMAX), min(image_np.shape[0], YMAX)
        extracted_image = image_np[YMIN:YMAX, XMIN:XMAX]
        outputs[class_name.lower()] = extracted_image
    return outputs

def load_and_preprocess_image(img):
    img = transform(img)
    img = img.unsqueeze(0)
    return img

def predict_gender(img_path):
    img = Image.open(img_path).convert('RGB')
    img = load_and_preprocess_image(img)
    with torch.no_grad():
        output = gender_model(img)
        _, predicted = torch.max(output, 1)
        return 'men' if predicted.item() == 0 else 'women'

def get_embedding_from_image(model, img):
    try:
        img = cv2.resize(img, (224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        embedding = model.predict(img_array)
        return embedding.flatten()
    except Exception as e:
        print(f"Error processing image: {e}")
        return np.zeros(model.output_shape[1])

def get_recommender(test_embedding, df, embeddings, top_n=1):
    test_embedding_reshaped = test_embedding.reshape(1, -1)
    similarities = cosine_similarity(embeddings, test_embedding_reshaped).flatten()
    sim_scores = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[:top_n+1] if sim_scores[0][1] < 1.0 else sim_scores[1:top_n+1]
    idx_rec = [i[0] for i in sim_scores[:top_n]]
    sim_values = [i[1] for i in sim_scores[:top_n]]
    recommended_items = df.iloc[idx_rec]
    return recommended_items, sim_values
