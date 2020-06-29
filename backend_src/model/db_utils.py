from contextlib import contextmanager
import sqlite3

from config import Config


@contextmanager
def open_db_cursor():
    connection = sqlite3.connect(Config.DB_PATH)
    yield connection.cursor()
    connection.commit()
