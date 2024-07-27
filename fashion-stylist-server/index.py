from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
import base64
import time

app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'


@app.post('/')
@cross_origin()
def generate_fashion_recommendation():
    image = request.files.get('image')

    # TODO: add model recommendation

    with open('Assets/recommendation-example.jpg', "rb") as recommendation_image:
        base64_image = base64.b64encode(recommendation_image.read())

    time.sleep(1)

    return base64_image


if __name__ == '__main__':
    app.run()
