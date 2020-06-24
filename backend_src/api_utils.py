import datetime
from functools import wraps

from flask import jsonify

from model.task import Status


class BadRequestException(Exception):
    def __init__(self, message):
        super().__init__()
        self.message = message


def api_jsonify_errors(fxn):
    @wraps(fxn)
    def wrapper(*args, **kwargs):
        try:
            return fxn(*args, **kwargs)
        except BadRequestException as e:
            return jsonify({'error': e.message}), 400

    return wrapper


def validate_and_load_params(params, key_to_types):
    received_keys = sorted(params.keys())
    expected_keys = sorted(key_to_types.keys())
    if received_keys != expected_keys:
        raise BadRequestException(f'Expected keys {expected_keys}, received {received_keys} instead')

    type_errors = []
    loaded_params = {}
    for key, value_type in key_to_types.items():
        value = params[key]
        loaded_value = None
        if isinstance(value_type, str):
            loaded_value = _try_load_custom_type(value, value_type)
        elif isinstance(value, value_type):
            loaded_value = value

        if loaded_value is None:
            type_errors.append(f'{key}:{value_type}')
        else:
            loaded_params[key] = loaded_value

    if len(type_errors) > 0:
        type_errors_str = ', '.join(type_errors)
        raise BadRequestException(f'Type mismatch(es), for following params, expected: {type_errors_str}')

    return loaded_params


def _try_load_custom_type(value, value_type):
    if value_type == 'yyyy-mm-dd':
        try:
            return datetime.datetime.strptime(value, '%Y-%m-%d')
        except ValueError:
            return None
    elif value_type == 'Status':
        try:
            return Status(value)
        except ValueError:
            return None
    else:
        raise ValueError(f'Unknown value_type "{value_type}"')
