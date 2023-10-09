module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
  plugins: ['import'],
  ignorePatterns: ['index.html'],
  globals: {
    defineOptions: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
  },
  rules: {
    'vue/require-default-prop': 'off',
    'no-console': 'warn',
    'no-debugger': 'off',

    // eslint
    semi: ['error', 'never'],
    'prefer-const': 1,
    'prefer-template': 1,
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'linebreak-style': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-bitwise': ['error', { int32Hint: true, allow: ['|', '&'] }],
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'no-shadow': ['error', { allow: ['state'] }],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'operator-linebreak': 'off',
    camelcase: [
      'error',
      {
        allow: [],
      },
    ],
    'import/no-cycle': ['error', { maxDepth: 1 }],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'no-param-reassign': ['error', { props: false }],
    'spaced-comment': ['error', 'always'],
    'object-shorthand': 'error',

    // vuejs-accessibility
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/label-has-for': 'off',

    // eslint-plugin-vue
    'vue/v-on-event-hyphenation': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-end-tags': 'off',
    'vue/html-indent': 'off',
    'vue/html-quotes': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    'vue/no-multi-spaces': 'off',
    'vue/no-spaces-around-equal-signs-in-attribute': 'off',
    'vue/max-len': [
      'error',
      {
        code: 120,
        template: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreHTMLAttributeValues: true,
      },
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: [
          'Checkbox',
          'Button',
          'Password',
          'Dropdown',
          'Avatar',
          'Column',
          'Toolbar',
          'Dialog',
          'Toast',
          'Skeleton',
          'Fieldset',
          'Tree',
        ],
      },
    ],
    'vue/no-template-shadow': 'off',
  },
}
