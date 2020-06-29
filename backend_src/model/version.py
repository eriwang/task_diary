VERSION = 1


def create_version_table(cursor):
    cursor.execute('CREATE TABLE version (version INTEGER)')
    cursor.execute('INSERT INTO version VALUES (?)', (VERSION, ))


def get_db_version(cursor):
    cursor.execute('SELECT * FROM version')
    return cursor.fetchone()[0]
