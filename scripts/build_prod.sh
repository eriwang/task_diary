#! /usr/bin/env bash

npx webpack --config webpack.prod.js
pyinstaller --add-data "backend_src/templates:templates" \
            --add-data "backend_src/static_gen:static_gen" \
            backend_src/app.py --noconfirm -F
