#! /usr/bin/env bash

# Requirements
REQ_PYTHON_MAJOR_VERSION=3
REQ_MIN_PYTHON_VERSION=3.6

# Functions

function get_python_version {
    echo $($1 -V 2>&1 | egrep -o "[0-9\.]*")
}

if [[ "-h" -eq $1 ]] || [[ "--help" -eq $1 ]]; then
    echo "USAGE: scripts/setup.sh <optional_python3_binary_location>. Should be run from repo root"
    exit 0
fi

# Validate Python version

PYTHON_BIN=${1:-python3}
PYTHON_VERSION=$(get_python_version $PYTHON_BIN)
PYTHON_MAJOR_VERSION=$(echo $PYTHON_VERSION | egrep -o "^[0-9]*")

if [[ PYTHON_MAJOR_VERSION -ne REQ_PYTHON_MAJOR_VERSION ]]; then
    echo "Expected to be run with Python major version $REQ_PYTHON_MAJOR_VERSION," \
         "got $PYTHON_MAJOR_VERSION instead" 1>&2 
    exit 1
fi

if [[ PYTHON_VERSION -lt REQ_MIN_PYTHON_VERSION ]]; then
    echo "Expected to be run with at least Python $REQ_MIN_PYTHON_VERSION," \
         "got $PYTHON_VERSION instead" 1>&2
    exit 1   
fi

# Not sure if any other versions need to be checked. Not checking for now.

npm ci
virtualenv --python=python venv

scripts/update.sh