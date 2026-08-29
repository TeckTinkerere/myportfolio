const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    // Workspace packages ship TypeScript source. Mapping them to the files
    // directly keeps them out of transformIgnorePatterns, which would
    // otherwise refuse to compile anything resolved through node_modules.
    '^@mohdaslam/ui/section$': '<rootDir>/../../packages/ui/src/section.tsx',
    '^@mohdaslam/ui/theme-provider$':
      '<rootDir>/../../packages/ui/src/theme-provider.tsx',
    '^@mohdaslam/ui/theme-toggle$':
      '<rootDir>/../../packages/ui/src/theme-toggle.tsx',
    '^@mohdaslam/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1.ts',
    '^@mohdaslam/content-rules$':
      '<rootDir>/../../packages/content-rules/src/index.ts',
    // Stubbed under Jest only — see the note in apps/site/jest.config.js.
    '^server-only$': '<rootDir>/test/stubs/server-only.js',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
