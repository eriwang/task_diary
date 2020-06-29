call npx webpack --config webpack.prod.js
call pyinstaller --add-data "backend_src/templates;templates" --add-data "backend_src/static_gen;static_gen" backend_src/app.py --noconfirm -F
