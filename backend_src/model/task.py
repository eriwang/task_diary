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
        self.date = date
        self.name = name
        self.is_planned = is_planned
        self.status = status
        self.notes = notes

    @classmethod
    def query_tasks_for_date(cls, cursor, date):
        cursor.execute('SELECT rowid, * FROM tasks WHERE date=?', (_date_to_seconds_since_epoch(date),))
        return [cls._create_from_fetch_result(result) for result in cursor.fetchall()]

    @classmethod
    def _create_from_fetch_result(cls, result):
        return cls(result[0], datetime.datetime.utcfromtimestamp(result[1]).date(), result[2], bool(result[3]),
                   Status(result[4]), result[5])

    def to_json_dict(self):
        return {
            'id': self.id,
            'date': self.date.strftime('%Y-%m-%d'),
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


def add_task(cursor, date, name, is_planned, status, notes):
    cursor.execute('INSERT INTO tasks VALUES (?, ?, ?, ?, ?)',
                   (_date_to_seconds_since_epoch(date), name, is_planned, status, notes))


def modify_task(cursor, task_id, field_to_changes):
    if len(field_to_changes) == 0:
        raise ValueError('Did not expect empty field_to_changes')

    field_and_changes = []
    for field, change in field_to_changes.items():
        if field == 'date':
            change = _date_to_seconds_since_epoch(change)
        field_and_changes.append((field, change))

    set_string = ', '.join([f'{fc[0]} = ?' for fc in field_and_changes])
    query_string = 'UPDATE tasks SET {} WHERE rowid = ?'.format(set_string)

    cursor.execute(query_string, [fc[1] for fc in field_and_changes] + [task_id])


def delete_task(cursor, task_id):
    cursor.execute('DELETE FROM tasks WHERE rowid = ?', (task_id,))


def _date_to_seconds_since_epoch(date):
    return datetime.datetime.combine(date, datetime.time(0, 0, 0), tzinfo=pytz.utc).timestamp()
