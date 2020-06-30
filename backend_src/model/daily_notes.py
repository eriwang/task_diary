import datetime

from datetime_utils import date_to_seconds_since_epoch


class DailyNotes:
    def __init__(self, notes_id, text, date):
        self.id = notes_id
        self.text = text
        self.date = date

    @classmethod
    def query_daily_notes_for_date(cls, cursor, date):
        cursor.execute('SELECT * FROM daily_notes WHERE date = ?', (date_to_seconds_since_epoch(date), ))
        results = list(cursor.fetchall())
        if len(results) == 0:
            return None

        if len(results) == 1:
            r = results[0]
            return cls(r[0], r[1], datetime.datetime.utcfromtimestamp(r[2]).date())

        raise ValueError(f'Found multiple daily_notes for date {date}')

    def to_json_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'date': self.date.strftime('%Y-%m-%d')
        }

    def __str__(self):
        return self.text


def create_daily_notes_table(cursor):
    query_string = '''
    CREATE TABLE daily_notes (
        id INTEGER PRIMARY KEY,
        text TEXT,
        date INTEGER
    )
    '''
    cursor.execute(query_string)


def add_daily_notes(cursor, name, date):
    cursor.execute('INSERT INTO daily_notes (text, date) VALUES (?, ?)', (name, date_to_seconds_since_epoch(date)))


def modify_daily_notes(cursor, notes_id, text):
    cursor.execute('UPDATE daily_notes SET text = ? WHERE id = ?', (text, notes_id))
