import datetime
from enum import IntEnum

import pytz


class Status(IntEnum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETE = 2
    DROPPED = 3


class Task:
    def __init__(self, task_id, date, name, is_planned, status, notes):
        self.id = task_id
        # TODO: Currently a string, should it be a pydate? depends on if I do anything with it on py side
        self.date = date
        self.name = name
        self.is_planned = is_planned
        self.status = status
        self.notes = notes

    @classmethod
    def query_all_tasks(cls, cursor):
        cursor.execute('SELECT rowid, * FROM tasks')
        # result[1] gets returned as text in ISO8601 format
        return [cls._create_from_fetch_result(result) for result in cursor.fetchall()]

    @classmethod
    def query_tasks_for_date(cls, cursor, date):
        cursor.execute('SELECT rowid, * FROM tasks WHERE date = ?', _date_to_seconds_since_epoch(date))
        return [cls._create_from_fetch_result(result) for result in cursor.fetchall()]

    @classmethod
    def _create_from_fetch_result(cls, result):
        # Although date is stored as an integer, SQLite returns it as an ISO format datetime string.
        _DATE_LENGTH = 10  # len('2020-06-18')
        return cls(result[0], result[1][:_DATE_LENGTH], result[2], bool(result[3]), Status(result[4]), result[5])

    def to_json_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'name': self.name,
            'is_planned': self.is_planned,
            'status': self.status,
            'notes': self.notes
        }

    def __str__(self):
        return f'{self.date}, {self.name}, {self.is_planned}, {self.status}, {self.notes}'


# date: midnight UTC seconds since epoch
def create_task_table(cursor):
    query_string = '''
    CREATE TABLE tasks (
        date INTEGER,
        name TEXT,
        is_planned INT2,
        status INT2,
        notes TEXT
    )
    '''
    cursor.execute(query_string)


def insert_task(cursor, date, name, is_planned, status, notes):
    cursor.execute('INSERT INTO tasks VALUES (?, ?, ?, ?, ?)',
                   (_date_to_seconds_since_epoch(date), name, is_planned, status, notes))


def _date_to_seconds_since_epoch(date):
    return datetime.datetime.combine(date, datetime.time(0, 0, 0), tzinfo=pytz.utc)
