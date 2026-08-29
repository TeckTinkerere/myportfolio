import type { Config } from 'tailwindcss'

import { instrumentPanel } from '@mohdaslam/ui/tailwind-preset'

/**
 * Same preset as the portfolio, so the two sites cannot drift apart on a
 * colour or a type scale. Only the content globs are local.
 */
const config: Config = {
  presets: [instrumentPanel],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
