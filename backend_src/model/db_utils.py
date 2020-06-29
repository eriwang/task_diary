from contextlib import contextmanager
import sqlite3

from config import Config


@contextmanager
def open_db_cursor(db_path=Config.DB_PATH):
    connection = sqlite3.connect(db_path)
    yield connection.cursor()
    connection.commit()
