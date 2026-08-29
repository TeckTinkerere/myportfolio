/**
 * Identity for the emcee site.
 *
 * Deliberately its own file rather than an import from the portfolio: these
 * are two separately deployed sites, and the emcee site should not fail to
 * build because a value moved in the other one. The overlap is three
 * strings, and they change roughly never.
 */
export const emceeConfig = {
  name: 'Run Sheets',
  owner: 'Mohamed Aslam',
  descriptor: 'Event hosting run sheets',
  description:
    'Run sheets for hosting events — running order, host notes, transitions and announcements, built to be read from a phone while a room is waiting.',

  /**
   * Canonical origin. Vercel sets NEXT_PUBLIC_SITE_URL on the emcee project;
   * the fallback is only what a local build uses.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://emcee.mohdaslam.dev',

  /** The portfolio this site broke out of. Shown once, in the footer. */
  portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://mohdaslam.dev',
} as const
