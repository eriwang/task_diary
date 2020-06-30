import argparse
import logging
import os

from flask import Flask, render_template

from api.daily_notes_api import daily_notes_bp
from api.goal_api import goal_bp
from api.task_api import task_bp
from config import Config
from model.db_management import init_db, check_version_and_upgrade_db_if_needed
from path_utils import create_file_parent_directories_if_needed

app = Flask(__name__, template_folder=Config.TEMPLATE_FOLDER, static_folder=Config.STATIC_FOLDER)
app.register_blueprint(daily_notes_bp)
app.register_blueprint(goal_bp)
app.register_blueprint(task_bp)


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


def parse_args():
    parser = argparse.ArgumentParser(description='Run the web server component for Task Diary.')
    parser.add_argument('--host', help='Host to run on. 127.0.0.1 by default.', default='127.0.0.1')
    parser.add_argument('--port', help='Port to run on. 5000 by default.', default=5000)
    parser.add_argument('--logpath', help=f'Where to log. {Config.LOG_PATH} by default.', default=Config.LOG_PATH)

    if not Config.IS_PROD:
        parser.add_argument('--debug', help='Run in flask debug mode.', action='store_true')
        parser.add_argument('--dbpath', help=f'Where the sqlite db file is store. {Config.DB_PATH} by default.',
                            default=Config.DB_PATH)

    return parser.parse_args()


def main():
    args = parse_args()

    # This entire config/ arg handling is weird: the defaults are set in config.py based on prod or not,
    # then they can be overwritten in the argument parsing. I wanted the DB path to be global so db_utils.py could
    # access it without a circular dependency, but I still wanted it to be modifiable on the command line.
    # Not optimal and can probably be managed better, but gets the job done.
    debug_mode = not Config.IS_PROD and args.debug

    Config.LOG_PATH = args.logpath
    if not Config.IS_PROD:
        Config.DB_PATH = args.dbpath

    print(f'Serving on {args.host}:{args.port}')
    print(f'DB_PATH={Config.DB_PATH}, LOG_PATH={Config.LOG_PATH}')

    create_file_parent_directories_if_needed(Config.LOG_PATH)
    logging.basicConfig(filename=Config.LOG_PATH, level=logging.DEBUG if debug_mode else logging.INFO)

    if os.path.exists(Config.DB_PATH):
        check_version_and_upgrade_db_if_needed(Config.DB_PATH)
    else:
        print(f'Did not find database at {Config.DB_PATH}, initializing.')
        init_db(Config.DB_PATH)

    app.run(debug=debug_mode, host=args.host, port=args.port)


if __name__ == '__main__':
    main()
