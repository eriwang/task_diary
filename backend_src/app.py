import argparse
import logging

from flask import Flask, render_template

from api.goal_api import goal_bp
from api.task_api import task_bp

app = Flask(__name__, static_folder='static_gen')
app.register_blueprint(goal_bp)
app.register_blueprint(task_bp)


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


def parse_args():
    parser = argparse.ArgumentParser(description='Run the web server component for Task Diary.')
    parser.add_argument('--debug', help='Run in flask debug mode', action='store_true')
    parser.add_argument('--host', help='Host to run on. 127.0.0.1 by default.', default='127.0.0.1')
    parser.add_argument('--port', help='Port to run on. 5000 by default.', default=5000)

    # If debug mode is on, the werkzeug reloader will run this file twice. When I build a pyinstaller binary with
    # --onefile sys.argv lists "<app_dir>/app" twice for some reason (at least on Linux). Using parse_known_args instead
    # of parse_args avoids a confusing argument error if you specify debug on this binary. The rest is a best effort
    # attempt to still die on supported arguments.
    known_args, unknown_args = parser.parse_known_args()
    unknown_args_remove_extra_app_arg = [a for a in unknown_args if not a.endswith('app')]
    if len(unknown_args_remove_extra_app_arg) != 0:
        raise ValueError(f'Found extra args: {unknown_args_remove_extra_app_arg}')

    return known_args


def main():
    args = parse_args()
    log_level = logging.DEBUG if args.debug else logging.INFO
    logging.basicConfig(filename='task_diary.log', level=log_level)
    app.run(debug=args.debug, host=args.host, port=args.port)


if __name__ == '__main__':
    main()
