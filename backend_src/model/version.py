VERSION = 2

'''
v1: Task and goal functionality
v2: Daily notes
'''

def create_version_table(cursor):
    cursor.execute('CREATE TABLE version (version INTEGER)')
    set_db_version(cursor)


def get_db_version(cursor):
    cursor.execute('SELECT * FROM version')
    return cursor.fetchone()[0]


def set_db_version(cursor):
    cursor.execute('DELETE FROM version')
    cursor.execute('INSERT INTO version VALUES (?)', (VERSION, ))
