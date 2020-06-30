import datetime
from enum import IntEnum

from datetime_utils import date_to_seconds_since_epoch


class Status(IntEnum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETE = 2
    DROPPED = 3


class Task:
    def __init__(self, task_id, date, name, is_planned, status, notes, goal_id, goal):
        self.id = task_id
        self.date = date
        self.name = name
        self.is_planned = is_planned
        self.status = status
        self.notes = notes
        self.goal_id = goal_id
        self.goal = goal

    @classmethod
    def query_tasks_for_date_with_goals(cls, cursor, date):
        cursor.execute('SELECT * FROM tasks LEFT JOIN goals ON tasks.goal_id = goals.id WHERE tasks.date = ?',
                       (date_to_seconds_since_epoch(date),))
        return [cls._create_from_fetch_result(result) for result in cursor.fetchall()]

    @classmethod
    def _create_from_fetch_result(cls, result):
        return cls(result[0], datetime.datetime.utcfromtimestamp(result[1]).date(), result[2], bool(result[3]),
                   Status(result[4]), result[5], result[7], result[8])  # result[6] is also a goal ID

    def to_json_dict(self):
        fields = {
            'id': self.id,
            'date': self.date.strftime('%Y-%m-%d'),
            'name': self.name,
            'is_planned': self.is_planned,
            'status': self.status,
            'notes': self.notes
        }
        if self.goal is not None:
            fields['goal'] = self.goal
            fields['goal_id'] = self.goal_id
        return fields

    def __str__(self):
        return f'{self.date}, {self.name}, {self.is_planned}, {self.status}, {self.notes}'


# date: midnight UTC seconds since epoch
def create_task_table(cursor):
    query_string = '''
    CREATE TABLE tasks (
        id INTEGER PRIMARY KEY,
        date INTEGER,
        name TEXT,
        is_planned INT2,
        status INT2,
        notes TEXT,
        goal_id INTEGER,
        FOREIGN KEY(goal_id) REFERENCES goals(id)
    )
    '''
    cursor.execute(query_string)


def add_task(cursor, date, name, is_planned, status, notes, goal_id=-1):
    query_string = '''
    INSERT INTO tasks
        (date, name, is_planned, status, notes, goal_id)
        VALUES (?, ?, ?, ?, ?, ?)
    '''
    goal_id = goal_id if goal_id != -1 else None
    values = [date_to_seconds_since_epoch(date), name, is_planned, status, notes, goal_id]
    cursor.execute(query_string, values)


def modify_task(cursor, task_id, field_to_changes):
    if len(field_to_changes) == 0:
        raise ValueError('Did not expect empty field_to_changes')

    field_and_changes = []
    for field, change in field_to_changes.items():
        if field == 'date':
            change = date_to_seconds_since_epoch(change)
        elif field == 'goal_id':
            change = change if change != -1 else None
        field_and_changes.append((field, change))

    set_string = ', '.join([f'{fc[0]} = ?' for fc in field_and_changes])
    query_string = 'UPDATE tasks SET {} WHERE id = ?'.format(set_string)

    cursor.execute(query_string, [fc[1] for fc in field_and_changes] + [task_id])


def delete_task(cursor, task_id):
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
