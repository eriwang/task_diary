from model.daily_notes import create_daily_notes_table
from model.db_utils import open_db_cursor
from model.goal import create_goal_table
from model.task import create_task_table
from model.version import VERSION, create_version_table, get_db_version, set_db_version
from path_utils import create_file_parent_directories_if_needed

def init_db(db_path):
    create_file_parent_directories_if_needed(db_path)

    with open_db_cursor(db_path) as cursor:
        create_version_table(cursor)
        create_daily_notes_table(cursor)
        create_goal_table(cursor)
        create_task_table(cursor)


def check_version_and_upgrade_db_if_needed(db_path):
    with open_db_cursor(db_path) as cursor:
        db_version = get_db_version(cursor)

    if db_version > VERSION:
        raise ValueError(f'db version {db_version} is greater than binary version {VERSION}, downgrades not supported')

    if db_version == VERSION:
        return

    with open_db_cursor(db_path) as cursor:
        if VERSION == 2:
            create_daily_notes_table(cursor)

        set_db_version(cursor)
