module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['CR-']
    }
  },
  formatter: '@commitlint/format',
  rules: {
    'scope-case': [2, 'always', 'start-case'],
    'subject-case': [2, 'always', 'sentence-case'],
  },
  ignores: [commit => commit === ''],
  defaultIgnores: true,
};
