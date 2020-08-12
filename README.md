# Task Diary

An app to record daily planned/ completed tasks to help with evaluating personal performance.

## First Time Setup

- You should have `python3` (3.6+), `node`, and `npm` installed.
- Run `scripts/setup.sh` from repo root.
    - This will install all `node`/ `python` dependencies, and create a Python virtualenv.
    - This will also install git hooks, which do style checks for the repo.

## Running the Server

Only dev mode supported at the moment. From repo root:

- `source venv/bin/activate`
- `python backend_src/app.py`
- `npx webpack`

Flask and webpack will continue to monitor changes to files as long as the commands are running.

## Credits

SVG for all icons used taken from https://feathericons.com/.