import nextVitals from 'eslint-config-next/core-web-vitals'

// Next 16 dropped `next lint`, so this app uses ESLint's flat config
// directly. The rules match apps/emcee/.eslintrc.json.
const config = [
  ...nextVitals,
  {
    rules: {
      '@next/next/no-img-element': 'error',
    },
  },
  {
    ignores: ['node_modules/', '.next/', 'out/', 'coverage/', 'next-env.d.ts'],
  },
]

export default config
