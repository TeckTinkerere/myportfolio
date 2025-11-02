# Future improvements and roadmap

This file captures medium-to-long-term improvements for the portfolio. Use it to plan follow-up work or open issues.

## Priority: High

- Add a blog/case studies section (MDX-based) to show thought process and measurable impact.
- Integrate a headless CMS (Strapi, Sanity, or Contentful) to manage projects and posts.
- Add analytics (Plausible or Google Analytics) with privacy-first settings.
- Implement full Lighthouse audit and reach 90+ scores across performance, accessibility, and best practices.

## Priority: Medium

- Create unit/integration tests for critical components (Jest + React Testing Library).
- Add i18n support for multiple languages.
- Improve image pipeline to generate AVIF/WebP and use responsive srcsets.
- Add caching headers and edge deployment optimizations for Vercel.

## Priority: Low

- Enable PWA features (manifest, service worker) for offline viewing.
- Add animations powered by Framer Motion and guard them with prefers-reduced-motion.
- Add a downloadable resume and printable resume layout.

## Notes

- Split large components into smaller, lazy-loaded chunks to reduce TTFB and JS payload.
- Use commit messages that reference issues for traceability.
