import sqlite3

from flask import Flask, jsonify, render_template, request

import api_utils as au
from model.task import Task, add_task, modify_task, delete_task

DB_FILEPATH = 'test.db'
app = Flask(__name__, static_folder='static_gen')


@app.route('/date_tasks', methods=['GET'])
@au.api_jsonify_errors
def api_get_tasks_for_date():
    _PARAM_KEY_TO_VALUE_TYPES = {
        'date': 'yyyy-mm-dd'
    }

    date = au.validate_and_load_params(request.args, _PARAM_KEY_TO_VALUE_TYPES)['date']
    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    return jsonify({'tasks': [a.to_json_dict() for a in Task.query_tasks_for_date(cursor, date)]}), 200


@app.route('/task', methods=['POST'])
@au.api_jsonify_errors
def api_add_task():
    _PARAM_KEY_TO_VALUE_TYPES = {
        'date': 'yyyy-mm-dd',
        'name': str,
        'is_planned': bool,
        'status': 'Status',
        'notes': str
    }

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    task = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    add_task(cursor, task['date'], task['name'], task['is_planned'], task['status'], task['notes'])

    connection.commit()

    return jsonify(success=True), 200


@app.route('/task', methods=['PUT'])
@au.api_jsonify_errors
def api_modify_task():
    _PARAM_KEY_TO_REQUIRED_VALUE_TYPES = {
        'id': int
    }
    _PARAM_KEY_TO_OPTIONAL_VALUE_TYPES = {
        'date': 'yyyy-mm-dd',
        'name': str,
        'is_planned': bool,
        'status': 'Status',
        'notes': str
    }

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    task_changes = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_REQUIRED_VALUE_TYPES,
                                               _PARAM_KEY_TO_OPTIONAL_VALUE_TYPES)

    if len(task_changes) == len(_PARAM_KEY_TO_REQUIRED_VALUE_TYPES):
        raise au.BadRequestException('Sent modify task request but no fields passed to modify')

    if 'status' in task_changes:
        task_changes['status'] = int(task_changes['status'])

    task_changes_no_id = task_changes.copy()
    task_id = task_changes_no_id.pop('id')

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    modify_task(cursor, task_id, task_changes_no_id)

    connection.commit()

    return jsonify(task_changes), 200


@app.route('/task', methods=['DELETE'])
@au.api_jsonify_errors
def api_delete_task():
    _PARAM_KEY_TO_VALUE_TYPES = {'id': int}

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    task_id = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)['id']

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    delete_task(cursor, task_id)

    connection.commit()

    return jsonify(success=True), 200


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
