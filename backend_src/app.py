import argparse
import logging

from flask import Flask, render_template

from api.goal_api import goal_bp
from api.task_api import task_bp
from config import Config

app = Flask(__name__, template_folder=Config.TEMPLATE_FOLDER, static_folder=Config.STATIC_FOLDER)
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

    # This is weird: the defaults are set in config.py based on prod or not, then they can be overwritten in the
    # argument parsing. I wanted the DB path to be global so db_utils.py could access it, but I still wanted it to be
    # modifiable on the command line. Not optimal, but gets the job done.
    Config.LOG_PATH = args.logpath
    Config.DB_PATH = args.dbpath

    logging.basicConfig(filename=Config.LOG_PATH, level=logging.DEBUG if args.debug else logging.INFO)

    print(f'Serving on {args.host}:{args.port}')
    print(f'DB_PATH={Config.DB_PATH}, LOG_PATH={Config.LOG_PATH}')
    app.run(debug=args.debug, host=args.host, port=args.port)


if __name__ == '__main__':
    main()
