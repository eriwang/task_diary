import sqlite3

from flask import Flask, jsonify, render_template, request

from api_utils import BadRequestException, api_jsonify_errors, validate_and_load_params
from model.task import Task, insert_task

DB_FILEPATH = 'test.db'
app = Flask(__name__, static_folder='static_gen')


@app.route('/date_tasks', methods=['GET'])
@api_jsonify_errors
def get_tasks_for_date():
    _PARAM_KEY_TO_VALUE_TYPES = {
        'date': 'yyyy-mm-dd'
    }

    date = validate_and_load_params(request.args, _PARAM_KEY_TO_VALUE_TYPES)['date']
    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    return jsonify({'tasks': [a.to_json_dict() for a in Task.query_tasks_for_date(cursor, date)]}), 200


@app.route('/task', methods=['POST'])
@api_jsonify_errors
def add_task():
    _PARAM_KEY_TO_VALUE_TYPES = {
        'date': 'yyyy-mm-dd',
        'name': str,
        'is_planned': bool,
        'status': 'Status',
        'notes': str
    }

    if not request.is_json:
        raise BadRequestException('Expected JSON mimetype')

    task = validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    insert_task(cursor, task['date'], task['name'], task['is_planned'], task['status'], task['notes'])

    connection.commit()

    return jsonify(success=True), 200


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
