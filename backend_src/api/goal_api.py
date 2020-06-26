from flask import Blueprint, jsonify, request

import api.api_utils as au
from model.db_utils import open_db_cursor
from model.goal import Goal, add_goal, modify_goal, delete_goal

goal_bp = Blueprint('goal', __name__)


@goal_bp.route('/all_goals', methods=['GET'])
@au.api_jsonify_errors
def api_get_all_goals():
    au.validate_and_load_params(request.args, {})

    with open_db_cursor() as cursor:
        goals = Goal.query_all_goals(cursor)

    return jsonify({'goals': [g.to_json_dict() for g in goals]}), 200


@goal_bp.route('/goal', methods=['POST'])
@au.api_jsonify_errors
def api_add_goal():
    _PARAM_KEY_TO_VALUE_TYPES = {'name': str}

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    goal_name = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)['name']

    with open_db_cursor() as cursor:
        add_goal(cursor, goal_name)

    return jsonify(success=True), 200


@goal_bp.route('/goal', methods=['PUT'])
@au.api_jsonify_errors
def api_modify_goal():
    _PARAM_KEY_TO_VALUE_TYPES = {'id': int, 'name': str}

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    goal = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)

    with open_db_cursor() as cursor:
        modify_goal(cursor, goal['id'], goal['name'])

    return jsonify(success=True), 200


# TODO: option to do a (poorman's) cascade or not
@goal_bp.route('/goal', methods=['DELETE'])
@au.api_jsonify_errors
def api_delete_goal():
    _PARAM_KEY_TO_VALUE_TYPES = {'id': int}

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    goal_id = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)

    with open_db_cursor() as cursor:
        delete_goal(cursor, goal_id)

    return jsonify(success=True), 200
