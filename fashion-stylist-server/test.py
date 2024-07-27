from flask import Flask, request, jsonify
import os
from utils import (predict_gender, extract_clothes, get_embedding_from_image, get_recommender, embeddings, df, embedding_model)

app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
        
    img_path = os.path.join('uploads', image_file.filename)
    image_file.save(img_path)

    detected_gender = predict_gender(img_path)
    extracted_clothes = extract_clothes(img_path)
    
    recommendations = {}

    for category in ['topwear', 'bottomwear', 'footwear']:
        if category in extracted_clothes:
            embedding = get_embedding_from_image(embedding_model, extracted_clothes[category])
            filtered_df = df[df['gender'].str.lower() == detected_gender.lower()]
            filtered_df = filtered_df[filtered_df['category'].str.lower() == category]
            if not filtered_df.empty:
                filtered_embeddings = embeddings[filtered_df.index]
                recommended_items, sim_values = get_recommender(embedding, filtered_df, filtered_embeddings, top_n=1)
                recommendations[category] = recommended_items.to_dict(orient='records')
    
    return jsonify({
        "gender": detected_gender,
        "recommendations": recommendations
    })

if __name__ == '__main__':
    app.run(debug=True, port=3001)
