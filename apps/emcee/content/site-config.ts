/**
 * Identity for the emcee site.
 *
 * This is a standalone hosting site, not an annex of the portfolio: it has
 * its own name, its own booking route and no links back. Values that happen
 * to match the portfolio (name, email) are restated here on purpose — the two
 * sites deploy separately, and this one should not fail to build because a
 * value moved in the other.
 */
export const emceeConfig = {
  name: 'Mohamed Aslam · Host',
  owner: 'Mohamed Aslam',
  descriptor: 'Host · Emcee · Facilitator',
  headline: 'I keep the room on time and on side.',
  description:
    'Mohamed Aslam hosts tech meetups, hackathons and workshops in Singapore — keeping the programme on time and the room with it.',

  /**
   * Canonical origin. Vercel sets NEXT_PUBLIC_SITE_URL on the emcee project;
   * the fallback is only what a local build uses.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://emcee.mohdaslam.dev',

  location: 'Singapore',

  booking: {
    email: 'aslam040607@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mohamed-aslam-abdul',
  },
} as const

/** A mailto that arrives with the three things needed to say yes or no. */
export const bookingHref = `mailto:${emceeConfig.booking.email}?subject=${encodeURIComponent(
  'Hosting enquiry',
)}&body=${encodeURIComponent('Event:\nDate:\nAudience size:\nFormat:\n')}`
