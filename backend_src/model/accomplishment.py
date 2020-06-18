import datetime
from enum import IntEnum

import pytz


class Status(IntEnum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETE = 2
    DROPPED = 3


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
