module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    "controllers/**/*.js",
    "helpers/**/*.js",
    "middlewares/**/*.js",
    "app.js"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testTimeout: 20000
};