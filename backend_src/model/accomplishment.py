import datetime
from enum import IntEnum

import pytz


class Status(IntEnum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETE = 2
    DROPPED = 3


class Accomplishment:
    def __init__(self, accomplishment_id, date, description, is_planned, status):
        self.id = accomplishment_id
        self.date = date
        self.description = description
        self.is_planned = is_planned
        self.status = status

    @classmethod
    def query_all_accomplishments(cls, cursor):
        cursor.execute('SELECT rowid, * FROM accomplishments')
        # result[1] gets returned as text in ISO8601 format
        return [cls(result[0], result[1][:len('2020-06-18')], result[2], bool(result[3]), Status(result[4]))
                for result in cursor.fetchall()]

    def to_json_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'description': self.description,
            'is_planned': self.is_planned,
            'status': self.status
        }

    def __str__(self):
        return f'{self.date}, {self.description}, {self.is_planned}, {self.status}'


# date: midnight UTC seconds since epoch
def create_accomplishment_table(cursor):
    query_string = '''
    CREATE TABLE accomplishments (
        date INTEGER,
        description TEXT,
        is_planned INT2,
        status INT2
    )
    '''
    cursor.execute(query_string)


def insert_accomplishment(cursor, date, description, is_planned, status):
    seconds_since_epoch = datetime.datetime.combine(date, datetime.time(0, 0, 0), tzinfo=pytz.utc)
    cursor.execute('INSERT INTO accomplishments VALUES (?, ?, ?, ?)',
                   (seconds_since_epoch, description, is_planned, status))
