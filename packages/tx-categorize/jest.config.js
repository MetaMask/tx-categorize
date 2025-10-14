module.exports = Object.assign({}, require('../../jest.config.packages'), {
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 25,
      functions: 20,
      lines: 30,
    },
  },
})
