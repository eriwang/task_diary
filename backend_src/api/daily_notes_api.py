from flask import Blueprint, jsonify, request

import api.api_utils as au
from model.db_utils import open_db_cursor
from model.daily_notes import DailyNotes, add_daily_notes, modify_daily_notes

daily_notes_bp = Blueprint('daily_note', __name__)


@daily_notes_bp.route('/daily_notes', methods=['GET'])
@au.api_jsonify_errors
def api_get_notes_for_date():
    _PARAM_KEY_TO_VALUE_TYPES = {'date': 'yyyy-mm-dd'}

    date = au.validate_and_load_params(request.args, _PARAM_KEY_TO_VALUE_TYPES)['date']

    with open_db_cursor() as cursor:
        notes = DailyNotes.query_daily_notes_for_date(cursor, date)

    return jsonify({'notes': None if notes is None else notes.to_json_dict()}), 200


@daily_notes_bp.route('/daily_notes', methods=['PUT'])
@au.api_jsonify_errors
def api_modify_notes():
    _PARAM_KEY_TO_VALUE_TYPES = {
        'date': 'yyyy-mm-dd',
        'text': str
    }

    if not request.is_json:
        raise au.BadRequestException('Expected JSON mimetype')

    request_notes = au.validate_and_load_params(request.get_json(), _PARAM_KEY_TO_VALUE_TYPES)

    with open_db_cursor() as cursor:
        db_notes = DailyNotes.query_daily_notes_for_date(cursor, request_notes['date'])
        if db_notes is None:
            add_daily_notes(cursor, request_notes['text'], request_notes['date'])
        else:
            modify_daily_notes(cursor, db_notes.id, request_notes['text'])

    return jsonify(success=True), 200
