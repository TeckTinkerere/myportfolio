/**
 * Re-exported so the many `@/lib/utils` imports across this app keep working
 * while the implementation lives in the shared design system.
 *
 * Imported from the './cn' subpath, never from a package barrel. A barrel
 * would make every one of those imports pull ThemeToggle, next-themes and a
 * pair of lucide icons into whatever chunk asked for a class merger — worth
 * about 10 kB on every route that renders the site chrome.
 */
export { cn } from '@mohdaslam/ui/cn'
