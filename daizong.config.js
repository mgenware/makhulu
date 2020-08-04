module.exports = {
  // Starts the development mode, which watches and compiles all source files including tests files.
  dev: {
    run: ['#clean', 'tsc -b tests -w'],
    env: {
      NODE_ENV: 'development',
    },
  },

  // Runs tests in development mode. You can keep two terminal tabs during development, one for `yarn dev`, the other for `yarn r t`.
  t: {
    run: 'mocha --require source-map-support/register dist_tests/**/*.test.js',
  },

  // Cleans, lints, compiles sources and runs tests.
  build: {
    run: ['#clean', 'tsc -b tests', '#lint', '#t'],
    env: {
      NODE_ENV: 'production',
    },
  },

  // Deletes compiled files, auto triggered by `yarn r dev` or `yarn r build`.
  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },

  // Lints the project using ESLint, auto triggered by `yarn r build`.
  lint: {
    run: 'eslint --max-warnings 0 --ext .ts src/ tests/',
  },
};
