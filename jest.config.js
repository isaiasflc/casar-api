const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/tests/', '.module.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/server.ts',
    '!<rootDir>/src/config/*.(t|j)s',
    '!<rootDir>/src/entities/*.(t|j)s',
    '!<rootDir>/src/modules/*/*.repository*.(t|j)s',
    '!<rootDir>/src/providers/logger/*.(t|j)s',
    '!<rootDir>/src/filters/*.(t|j)s',
    '!<rootDir>/src/interceptors/*.(t|j)s',
    '!<rootDir>/src/shared/errors/*.(t|j)s',
    '!<rootDir>/src/shared/providers/logger/*.(t|j)s',
    '!<rootDir>/src/shared/constants/*.(t|j)s',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary'],
  transform: tsjPreset.transform,
  setupFiles: ['./setupTest.js'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
