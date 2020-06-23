import datetime
from enum import IntEnum

import pytz


class Status(IntEnum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETE = 2
    DROPPED = 3


class Task:
    def __init__(self, task_id, date, description, is_planned, status, notes):
        self.id = task_id
        self.date = date
        self.description = description
        self.is_planned = is_planned
        self.status = status
        self.notes = notes

    @classmethod
    def query_all_tasks(cls, cursor):
        cursor.execute('SELECT rowid, * FROM tasks')
        # result[1] gets returned as text in ISO8601 format
        # TODO: ideally the date should be a pydate. Ends up being a double conversion but imo it's clearer
        return [cls(result[0], result[1][:len('2020-06-18')], result[2], bool(result[3]), Status(result[4]), result[5])
                for result in cursor.fetchall()]

    def to_json_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'description': self.description,
            'is_planned': self.is_planned,
            'status': self.status,
            'notes': self.notes
        }

    def __str__(self):
        return f'{self.date}, {self.description}, {self.is_planned}, {self.status}, {self.notes}'


# date: midnight UTC seconds since epoch
def create_task_table(cursor):
    query_string = '''
    CREATE TABLE tasks (
        date INTEGER,
        description TEXT,
        is_planned INT2,
        status INT2,
        notes TEXT
    )
    '''
    cursor.execute(query_string)


def insert_task(cursor, date, description, is_planned, status, notes):
    seconds_since_epoch = datetime.datetime.combine(date, datetime.time(0, 0, 0), tzinfo=pytz.utc)
    cursor.execute('INSERT INTO tasks VALUES (?, ?, ?, ?, ?)',
                   (seconds_since_epoch, description, is_planned, status, notes))
