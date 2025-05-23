from flask import Flask, request, jsonify, session
import os
from utils import (predict_gender, extract_clothes, get_embedding_from_image, get_recommender, embeddings, df, embedding_model)

from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from bson import ObjectId

app = Flask(__name__, static_folder='public')
app.config['SECRET_KEY'] = 'fashionstylish'
app.config['MONGO_URI'] = 'mongodb+srv://omeror:YyBgekx4Xvm14AZw@scrapers.rbagytw.mongodb.net/fashiondb?retryWrites=true&w=majority'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookies are only sent over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript from accessing the session cookie
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Adjust based on your cross-origin needs

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)

# Collection for storing user data
users_collection = mongo.db.test

@app.post('/')
@cross_origin()
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
                recommended_items, sim_values = get_recommender(embedding, filtered_df, filtered_embeddings, top_n=8)
                recommendations[category] = recommended_items.to_dict(orient='records')
    return jsonify({
        "gender": detected_gender,
        "recommendations": recommendations
    })


@app.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    favorites = []

    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400

    # Hash the password and save the user
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = users_collection.insert_one({
        'email': email,
        'password': hashed_password,
        'name': name,
        'favorites': favorites
    }).inserted_id

    return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201

@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = users_collection.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Store user information in session
    session['user_id'] = str(user['_id'])
    session['email'] = user['email']
    session['name'] = user['name']

    return jsonify({'message': 'Logged in successfully', 'user': {
        'id': session['user_id'],
        'email': session['email'],
        'name': session['name']
    }}), 200

@app.route('/profile', methods=['GET'])
@cross_origin(supports_credentials=True)
def profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    # Retrieve the user profile from the database
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': str(user['_id']),
        'email': user['email'],
        'name': user['name'],
        'favorites': user['favorites']
    }), 200


@app.route('/logout', methods=['POST'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route('/updateFavorites', methods=['POST'])
@cross_origin(supports_credentials=True)
def toggle_favorite():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    item = {
        'id': data.get('id'),
        'link': data.get('link'),
        'title': data.get('title'),
        'price': data.get('price'),
        'img': data.get('img'),
        'brand': data.get('brand')
    }

    # Find the user
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Check if the item is already in favorites
    favorites = user.get('favorites', [])
    if any(fav['id'] == item['id'] for fav in favorites):
        # If the item is already in favorites, remove it
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'favorites': {'id': item['id']}}}
        )
        return jsonify({'message': 'Item removed from favorites'}), 200
    else:
        # If the item is not in favorites, add it
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'favorites': item}}
        )
        return jsonify({'message': 'Item added to favorites'}), 200


@app.route('/userInfo', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user_info():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401    

    # Find the user
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': str(user['_id']),
        'email': user['email'],
        'name': user['name'],
        'favorites': user['favorites']
    }), 200
    


if __name__ == '__main__':
    app.run(debug=True, port=5000)