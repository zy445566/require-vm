module.exports = {
  'env': {
    'commonjs': true,
    'node': true,
    'es6': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'quotes': ['warn', 'single', {'avoidEscape': true}],
    'eqeqeq': ['warn', 'smart'],
    'semi': ['warn', 'always'],
    'indent': ['error', 2, {'MemberExpression': 1, 'ArrayExpression': 1, 'ObjectExpression': 1}],
    'func-call-spacing': ['error', 'never'],
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': ['warn', {before: false, after: true}],
    'no-path-concat': 'error',
    'no-var': 'error',
  },
};
