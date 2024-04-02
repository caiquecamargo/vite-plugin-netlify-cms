import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    quotes: 'single',
    semi: true,
  },
  typescript: {
    overrides: {
      'no-console': 'off',
    },
  },
  vue: {
    overrides: {
      'vue/block-order': [['template', 'script'], 'style'],
    },
  },
});
