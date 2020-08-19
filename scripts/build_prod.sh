#! /usr/bin/env bash

npx webpack
pyinstaller --add-data "backend_src/templates:templates" \
            --add-data "backend_src/static_gen:static_gen" \
            backend_src/app.py --noconfirm -F
