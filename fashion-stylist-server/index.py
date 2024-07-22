from flask import Flask

app = Flask(__name__)


@app.route('/')
def get_fashion_recommendation():
    # TODO: add model recommendation

    return 'yes'


if __name__ == '__main__':
    app.run()
