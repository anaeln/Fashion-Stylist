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
yolo_model = YOLO('fashion-stylist-server/models/yolo-model/best.pt')  # Update with your YOLO model path

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
state_dict = torch.load('fashion-stylist-server/models/gender_classification_model/gender_classification_model.pth')
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
with open('fashion-stylist-server/models/image-embeddings/terminalx_embeddings.pkl', 'rb') as f:
    embeddings_dict = pickle.load(f)
df = pd.read_csv('fashion-stylist-server/models/image-embeddings/dataset_with_embeddings-new.csv')

# Create a dictionary to map image names to genders
df['_id'] = df['_id'].str.split('.').str[0]  # Remove file extension if needed
image_gender_map = df.set_index('_id')['gender'].to_dict()

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

def recommend_items(part_name, query_embedding, gender, top_n=5):
    similarities = []

    # Reshape the query embedding to be 2D: (1, n_features)
    query_embedding = query_embedding.reshape(1, -1)

    # Loop through each item in the dataset and calculate similarity
    for idx in df.index:
        if df.loc[idx, 'category'].lower() == part_name and df.loc[idx, 'gender'].lower() == gender.lower():
            img_name = df.loc[idx, '_id']  # Get the image name without the extension
            key = f"{img_name}.jpg_{part_name}"  # Format the key to match the embeddings_dict keys

            if key in embeddings_dict:
                embedding = embeddings_dict[key]

                # Reshape the stored embedding as well to be 2D
                embedding = embedding.reshape(1, -1)

                # Calculate similarity
                sim = cosine_similarity(query_embedding, embedding)

                # If the similarity is less than a very high threshold (indicating it's not the same image), include it
                if sim[0][0] < 0.999999:  # Use a threshold slightly less than 1
                    similarities.append((key, sim[0][0]))

    # Sort by similarity score in descending order
    similarities = sorted(similarities, key=lambda x: x[1], reverse=True)

    # Get top N recommendations
    top_recommendations = similarities[:top_n]

    # Map the recommended image names to their corresponding metadata
    recommended_items = []
    for rec in top_recommendations:
        img_name = rec[0].split('.')[0]  # Get the image name without the part suffix
        item_data = df[df['_id'] == img_name].iloc[0].to_dict()
        item_data['similarity'] = float(rec[1])  # Convert similarity to Python float for JSON serialization
        recommended_items.append(item_data)

    return recommended_items



