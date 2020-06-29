from model.db_utils import open_db_cursor
from model.goal import create_goal_table
from model.task import create_task_table
from model.version import VERSION, create_version_table, get_db_version
from path_utils import create_file_parent_directories_if_needed

def init_db(db_path):
    create_file_parent_directories_if_needed(db_path)

    with open_db_cursor(db_path) as cursor:
        create_version_table(cursor)
        create_goal_table(cursor)
        create_task_table(cursor)


def upgrade_db_if_needed(db_path):
    with open_db_cursor(db_path) as cursor:
        db_version = get_db_version(cursor)

    if db_version != VERSION:
        raise ValueError('Found differing db versions, upgrades not supported yet')
