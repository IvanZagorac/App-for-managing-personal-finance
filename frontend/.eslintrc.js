module.exports = {
    env: {
        es6: true,
        node: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './tsconfig.eslint.json',
            './tsconfig.json',
        ],
        ecmaVersion: 6,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'eslint-plugin-tsdoc',
    ],
    rules: {
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/brace-style': 'off',
        // '@typescript-eslint/lines-between-class-members': 'off',
        indent: ['error', 4],
        'react/jsx-filename-extension': 0,
        'brace-style': ['error', 'allman'],
        'no-throw-literal': 0,
        'max-len': ['error', 120],
        'object-shorthand': ['error', 'always'],
        curly: ['error', 'all'],
        quotes: ['error', 'single'],
        'prefer-const': ['error', {
            'destructuring': 'any',
            'ignoreReadBeforeAssign': false
        }],
        'no-restricted-syntax': [
            'error',
            {
                selector: 'LabeledStatement',
                message: `Labels are a form of GOTO;
                using them makes code confusing and hard to maintain and understand.`,
            },
            {
                selector: 'WithStatement',
                message: `'with' is disallowed in strict mode
                because it makes code impossible to predict and optimize.`,
            },
        ],
        'no-continue': 0,
        'no-console': 0,
        'no-param-reassign': ['error', { props: false }],
        'linebreak-style': 0,
    },

};
