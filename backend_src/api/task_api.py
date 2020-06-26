from flask import Blueprint, jsonify, request

import api.api_utils as au
from model.db_utils import open_db_cursor
from model.task import Task, add_task, modify_task, delete_task

task_bp = Blueprint('task', __name__)


@task_bp.route('/date_tasks', methods=['GET'])
@au.api_jsonify_errors
def api_get_tasks_for_date():
    _PARAM_KEY_TO_VALUE_TYPES = {'date': 'yyyy-mm-dd'}

    date = au.validate_and_load_params(request.args, _PARAM_KEY_TO_VALUE_TYPES)['date']

    with open_db_cursor() as cursor:
        tasks = Task.query_tasks_for_date_with_goals(cursor, date)

    return jsonify({'tasks': [t.to_json_dict() for t in tasks]}), 200


@task_bp.route('/task', methods=['POST'])
@au.api_jsonify_errors
def api_add_task():
    _PARAM_KEY_TO_REQUIRED_VALUE_TYPES = {
        'date': 'yyyy-mm-dd',
        'name': str,
        'is_planned': bool,
        'status': 'Status',
        'notes': str
    }
    _PARAM_KEY_TO_OPTIONAL_VALUE_TYPES = {'goal_id': int}

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    task = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_REQUIRED_VALUE_TYPES,
                                       _PARAM_KEY_TO_OPTIONAL_VALUE_TYPES)

    with open_db_cursor() as cursor:
        add_task(cursor, task['date'], task['name'], task['is_planned'], task['status'], task['notes'],
                 task['goal_id'] if 'goal_id' in task else None)

    return jsonify(success=True), 200


@task_bp.route('/task', methods=['PUT'])
@au.api_jsonify_errors
def api_modify_task():
    _PARAM_KEY_TO_REQUIRED_VALUE_TYPES = {'id': int}
    _PARAM_KEY_TO_OPTIONAL_VALUE_TYPES = {
        'date': 'yyyy-mm-dd',
        'name': str,
        'is_planned': bool,
        'status': 'Status',
        'notes': str,
        'goal_id': int
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

    with open_db_cursor() as cursor:
        modify_task(cursor, task_id, task_changes_no_id)

    return jsonify(task_changes), 200


@task_bp.route('/task', methods=['DELETE'])
@au.api_jsonify_errors
def api_delete_task():
    _PARAM_KEY_TO_VALUE_TYPES = {'id': int}

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    task_id = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)['id']

    with open_db_cursor() as cursor:
        delete_task(cursor, task_id)

    return jsonify(success=True), 200
