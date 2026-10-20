const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@mohdaslam/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1.ts',
    // Stubbed under Jest only — see the note in apps/site/jest.config.js.
    '^server-only$': '<rootDir>/test/stubs/server-only.js',
  },
}

module.exports = createJestConfig(customJestConfig)
