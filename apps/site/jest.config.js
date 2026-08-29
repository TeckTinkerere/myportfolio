const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
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
    // The real package throws by design when imported outside a server
    // component. That guard is what protects the content layer in the app,
    // but under Jest it would block the very tests that verify the layer, so
    // it is stubbed here only.
    '^server-only$': '<rootDir>/test/stubs/server-only.js',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)