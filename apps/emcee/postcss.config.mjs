/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Must run before Tailwind. The design system lives in
    // @mohdaslam/ui/styles.css and uses @layer and @apply, which Tailwind can
    // only process if the import has already been inlined by the time it
    // sees the file.
    'postcss-import': {},
    tailwindcss: {},
  },
};

export default config;
