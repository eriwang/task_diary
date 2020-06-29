import argparse
import datetime
import os

from model.db_management import init_db
from model.db_utils import open_db_cursor
from model.goal import add_goal
from model.task import Status, add_task

_LOREM_IPSUM = '''\
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna \
aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."\
'''


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

    init_db(db_filepath)

    if args.add_dummy_data:
        with open_db_cursor(db_filepath) as cursor:
            add_goal(cursor, 'Goal 1')
            add_goal(cursor, 'Goal 2')
            add_goal(cursor, 'Goal 3')

            add_task(cursor, datetime.date.today() - datetime.timedelta(days=2), 't - 2 task', True,
                     Status.NOT_STARTED, 't - 2 notes')
            add_task(cursor, datetime.date.today() - datetime.timedelta(days=1), 'yesterday task', True,
                     Status.NOT_STARTED, 'yesterday notes')
            add_task(cursor, datetime.date.today(), 'today task', True, Status.NOT_STARTED, 'today notes', 1)
            add_task(cursor, datetime.date.today(), 'today task 2', True, Status.NOT_STARTED, 'today notes 2', 2)
            add_task(cursor, datetime.date.today(), 'lorem ipsum', False, Status.IN_PROGRESS, _LOREM_IPSUM)


if __name__ == '__main__':
    main()
