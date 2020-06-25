import argparse
import datetime
import os
import sqlite3

from model.task import Status, create_task_table, add_task

def parse_args():
    parser = argparse.ArgumentParser(description='Init a db file with a proper schema.')
    parser.add_argument('db_filepath', help='.db file to use.')
    parser.add_argument('--delete-existing-db', help='If db exists, deletes it and continues', action='store_true')
    parser.add_argument('--add-dummy-data', help='Adds dummy data to the database for testing purposes.',
                        action='store_true')
    return parser.parse_args()


def main():
    args = parse_args()
    db_filepath = args.db_filepath
    if os.path.exists(db_filepath):
        if args.delete_existing_db:
            os.remove(db_filepath)
        else:
            raise ValueError(f'{db_filepath} already exists, '
                             f'if you want to clear it and reinit run with --delete-existing-db')

    connection = sqlite3.connect(db_filepath)
    cursor = connection.cursor()

    create_task_table(cursor)

    if args.add_dummy_data:
        add_task(cursor, datetime.date.today() - datetime.timedelta(days=2), 't - 2 task', True,
                 Status.NOT_STARTED, 't - 2 notes')
        add_task(cursor, datetime.date.today() - datetime.timedelta(days=1), 'yesterday task', True,
                 Status.NOT_STARTED, 'yesterday notes')
        add_task(cursor, datetime.date.today(), 'today task', True, Status.NOT_STARTED, 'today notes')
        add_task(cursor, datetime.date.today(), 'today task 2', True, Status.NOT_STARTED, 'today notes 2')

    connection.commit()


if __name__ == '__main__':
    main()
