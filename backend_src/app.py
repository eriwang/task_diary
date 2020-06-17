from flask import Flask, render_template

app = Flask(__name__, static_folder='static_gen')


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html', text='Hello world')


if __name__ == '__main__':
    app.run(debug=True)
