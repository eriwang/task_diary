module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'es2020': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 11,
        'sourceType': 'module'
    },
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'max-len': ['error', 120],
        'no-var': ['error'],
        'no-prototype-builtins': ['off']
    },
    'ignorePatterns': ['backend_src/**', 'venv/**']
};
