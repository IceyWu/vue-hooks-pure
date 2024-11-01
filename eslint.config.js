import antfu from '@antfu/eslint-config'

export default antfu({
  overrides: {
    typescript: {
      'ts/ban-ts-comment': 'off',
      'ts/prefer-ts-expect-error': 'off',
      'ts/consistent-indexed-object-style': 'off',
      'no-console': 'off',
      'ts/no-unused-expressions': 'off',
      'ts/no-unsafe-function-type': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },

  ignores: ['play/'],
})
