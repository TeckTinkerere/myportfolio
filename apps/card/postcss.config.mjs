/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Must run before Tailwind — see the note in apps/emcee/postcss.config.mjs.
    'postcss-import': {},
    tailwindcss: {},
  },
}

export default config
