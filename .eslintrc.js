module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "2017",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    ["react", "babel"]
  ],
  "root": true,
  "rules": {
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "indent": [
      "error",
      2,
      { "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "react/jsx-curly-spacing": [
      "error",
      "never",
      { "allowMultiline": false }
    ],
    "react/jsx-key": [
      "error"
    ],
    "react/jsx-max-props-per-line": [
      "error",
      { "maximum": 2 }
    ],
    "react/prop-types": [
      2
    ],
    "react/jsx-max-props-per-line": [
      "error",
      { "maximum": 2 }
    ],
    "react/prefer-stateless-function": [
      "error"
    ],
    "react/jsx-wrap-multilines": [
      "error"
    ],
    "react/prop-types": 0,
    "quotes": [
      "error",
      "single"
    ],
    "no-console": [
      "error",
      { "allow": [
          "warn",
          "error"
        ]
      }
    ],
    "no-invalid-this": 0,
    "babel/no-invalid-this": 1
  },
  "settings": {
    "react": {
      "version": "17.0.1"
    }
  }
};
