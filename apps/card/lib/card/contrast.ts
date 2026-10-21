import { contrast, readableOn } from './color'
import type { CardDoc } from './schema'

/**
 * Readability problems with a card's colours, in plain words, for the
 * editor to show while someone designs. Uses WCAG 2.x contrast: 4.5:1 for
 * body text. Advice, not a gate: an owner can still publish.
 */
export function themeWarnings(theme: CardDoc['theme']): string[] {
  const warnings: string[] = []
  const text = theme.text === 'light' ? '#ffffff' : '#0b0b0f'
  const bg = theme.background

  if (bg.style === 'image') {
    if (bg.image && bg.overlay < 35) {
      warnings.push('Text over a photo is hard to read without a stronger overlay. Try 40% or more.')
    }
  } else {
    const colours = bg.style === 'solid' ? [bg.from] : [bg.from, bg.to]
    for (const c of colours) {
      const ratio = contrast(text, c)
      if (ratio < 4.5) {
        warnings.push(
          `${theme.text === 'light' ? 'Light' : 'Dark'} text on ${c} has a contrast of ${ratio.toFixed(1)}:1. Aim for 4.5:1 or more, or switch the text colour.`,
        )
      }
    }
  }

  const onAccent = contrast(theme.accent, readableOn(theme.accent))
  if (onAccent < 4.5) {
    warnings.push(`The Save contact label is hard to read on ${theme.accent} (${onAccent.toFixed(1)}:1). Pick a darker or lighter accent.`)
  }
  if (bg.style !== 'image' && contrast(theme.accent, bg.to) < 1.6) {
    warnings.push('The Save contact button blends into the background. Pick an accent that stands out more.')
  }

  return warnings
}
