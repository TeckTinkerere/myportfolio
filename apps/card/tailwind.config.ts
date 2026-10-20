import type { Config } from 'tailwindcss'

import { instrumentPanel } from '@mohdaslam/ui/tailwind-preset'

/**
 * The editor, login and admin chrome use the shared preset, so they look
 * like the rest of mohdaslam.dev. Public cards do not: each card styles
 * itself from its own theme through CSS variables (components/card).
 */
const config: Config = {
  presets: [instrumentPanel],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
