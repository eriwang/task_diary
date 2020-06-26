from flask import Flask, render_template

from api.goal_api import goal_bp
from api.task_api import task_bp

app = Flask(__name__, static_folder='static_gen')
app.register_blueprint(goal_bp)
app.register_blueprint(task_bp)


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
