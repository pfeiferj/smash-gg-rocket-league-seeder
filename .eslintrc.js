module.exports = exports = {
  "env": {
    "node": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 2019,
  },
  "extends": "eslint:recommended",
  "rules": {
    // enable additional rules
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
    "array-callback-return": "warn",
    "complexity": ["warn", 10],
    "dot-notation": "error",
    "no-invalid-this": "error",
    "no-loop-func": "error",
    "no-param-reassign": "error",
    "no-use-before-define": "error",
    "global-require": "warn",
  }
}
