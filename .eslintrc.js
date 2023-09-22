// http://eslint.org/docs/user-guide/configuring

function getCommentsRule() {
  if (process.env.NODE_ENV === "development") {
    return 0;
  }

  if (process.env.TODO) {
    return [
      2,
      {
        terms: ["todo", "fixme", "xxx", "mock", "test",],
        location: "start",
      },
    ];
  }

  if (process.env.REVIEW) {
    return [
      2,
      {
        terms: ["review"],
        location: "start",
      },
    ];
  }

  if (process.env.TEMP_NOTES) {
    return [
      2,
      {
        terms: ["temp"],
        location: "start",
      },
    ];
  }

  return 0;
}

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  env: {
    es6: true,
  },
  plugins: ["import", "@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "ziu",
  ],
  globals: {
    Behavior: true,
  },
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".aliapp.ts", ".weapp.ts"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts", ".aliapp.ts", ".weapp.ts"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".aliapp.ts", ".weapp.ts"],
      },
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".aliapp.ts", ".weapp.ts"],
      },
    },
    "import/ignore": [
      "node_modules",
      "\\.(coffee|scss|css|less|hbs|svg|json)$",
    ],
  },
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      rules: {
        "no-undef": "off",
      },
    },
  ],
  // add your custom rules here
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/camelcase": 0,
    "prefer-promise-reject-errors": 0,
    "object-curly-newline": 0,
    "class-methods-use-this": 0,
    "no-plusplus": 0,
    "no-useless-escape": 0,
    "no-param-reassign": ["error", { props: false }],
    // "implicit-arrow-linebreak": ["error", "below"],
    // "function-paren-newline": ["error", "always"],
    "linebreak-style": 0,
    "no-use-before-define": 0,
    "operator-linebreak": [
      2,
      "after",
      {
        overrides: {
          "?": "before",
          ":": "before",
        },
      },
    ],
    // not require constant expressions in conditions
    "no-constant-condition": 0,
    // not require === and !===
    eqeqeq: 0,
    // allow multiline strings
    "no-multi-str": 0,
    // enforce 4 space indent
    indent: ["error", 2, { SwitchCase: 1 }],
    // undef
    "no-undef": 2,
    // allow variable decalared separately in functions
    "one-var": 0,
    // allow either backticks, double or single quotes
    quotes: 0,
    // enforce no sapce before function parent
    "space-before-function-paren": ["error", "never"],
    // not require camlecase
    camelcase: 0,
    // not require newline at the end of files
    "eol-last": 0,
    // disallow semi in line end
    semi: ["error", "always"],
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-warning-comments": getCommentsRule(),
  },
};
