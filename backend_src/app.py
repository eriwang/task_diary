import datetime
import sqlite3

from flask import Flask, jsonify, render_template, request

from model.accomplishment import Accomplishment, Status, insert_accomplishment

DB_FILEPATH = 'test.db'
app = Flask(__name__, static_folder='static_gen')


# TODO: don't think I'll need this route
@app.route('/all_accomplishments', methods=['GET'])
def get_all_accomplishments():
    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    accomplishments = Accomplishment.query_all_accomplishments(cursor)
    return jsonify({'accomplishments': [a.to_json_dict() for a in accomplishments]})


@app.route('/accomplishment', methods=['POST'])
def add_accomplishment():
    if not request.is_json:
        return jsonify({'error': 'Expected JSON mimetype'}), 400

    accomplishment = request.get_json()
    received_keys = sorted(accomplishment.keys())
    _EXPECTED_KEYS = ['date', 'description', 'is_planned', 'status']
    if received_keys != _EXPECTED_KEYS:
        return jsonify({'error': f'Expected keys {_EXPECTED_KEYS}, received {received_keys} instead'}), 400

    if not isinstance(accomplishment['date'], str) or \
            not isinstance(accomplishment['description'], str) or \
            not isinstance(accomplishment['is_planned'], bool) or \
            not isinstance(accomplishment['status'], int):
        return jsonify({'error': 'Type mismatch, expected date:str, description:str, is_planned:bool, status:int'}), 400

    try:
        date = datetime.datetime.strptime(accomplishment['date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': f'Expected date in YYYY-mm-dd format, received {accomplishment["date"]}'}), 400

    try:
        status = Status(accomplishment['status'])
    except ValueError:
        return jsonify({'error': f'Received invalid status {accomplishment["status"]}'}), 400

    connection = sqlite3.connect(DB_FILEPATH)
    cursor = connection.cursor()
    insert_accomplishment(cursor, date, accomplishment['description'], accomplishment['is_planned'], status)

    connection.commit()

    return jsonify(success=True), 200


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
