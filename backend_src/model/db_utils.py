from contextlib import contextmanager
import sqlite3

DB_FILEPATH = 'test.db'

@contextmanager
def open_db_cursor():
    connection = sqlite3.connect(DB_FILEPATH)
    yield connection.cursor()
    connection.commit()
