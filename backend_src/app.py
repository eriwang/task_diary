import datetime
import sqlite3

from flask import Flask, jsonify, render_template, request

from model.task import Task, Status, insert_task

DB_FILEPATH = 'test.db'
app = Flask(__name__, static_folder='static_gen')


# TODO: don't think I'll need this route long term
@app.route('/all_tasks', methods=['GET'])
def get_all_tasks():
    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    tasks = Task.query_all_tasks(cursor)
    return jsonify({'tasks': [a.to_json_dict() for a in tasks]})


# TODO: extract out validation/ general api logic somehow
@app.route('/date_tasks', methods=['GET'])
def get_tasks_for_date():
    task = request.args
    received_keys = sorted(task.keys())
    _EXPECTED_KEYS = sorted(['date'])
    if received_keys != _EXPECTED_KEYS:
        return jsonify({'error': f'Expected keys {_EXPECTED_KEYS}, received {received_keys} instead'}), 400

    if not isinstance(task['date'], str):
        return jsonify({'error': 'Type mismatch, expected date:str'}), 400

    try:
        date = datetime.datetime.strptime(task['date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': f'Expected date in YYYY-mm-dd format, received {task["date"]}'}), 400

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    return jsonify({'tasks': [a.to_json_dict() for a in Task.query_tasks_for_date(cursor, date)]}), 200


# TODO: should this even take status?
@app.route('/task', methods=['POST'])
def add_task():
    if not request.is_json:
        return jsonify({'error': 'Expected JSON mimetype'}), 400

    task = request.get_json()
    received_keys = sorted(task.keys())
    _EXPECTED_KEYS = sorted(['date', 'name', 'is_planned', 'status', 'notes'])
    if received_keys != _EXPECTED_KEYS:
        return jsonify({'error': f'Expected keys {_EXPECTED_KEYS}, received {received_keys} instead'}), 400

    if not isinstance(task['date'], str) or \
            not isinstance(task['name'], str) or \
            not isinstance(task['is_planned'], bool) or \
            not isinstance(task['status'], int) or \
            not isinstance(task['notes'], str):
        return jsonify({'error': 'Type mismatch, expected date:str, name:str,'
                                 ' is_planned:bool, status:int, notes:str'}), 400

    try:
        date = datetime.datetime.strptime(task['date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': f'Expected date in YYYY-mm-dd format, received {task["date"]}'}), 400

    try:
        status = Status(task['status'])
    except ValueError:
        return jsonify({'error': f'Received invalid status {task["status"]}'}), 400

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    insert_task(cursor, date, task['name'], task['is_planned'], status,
                task['notes'])

    connection.commit()

    return jsonify(success=True), 200


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
