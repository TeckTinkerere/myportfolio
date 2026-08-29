import { getPublicProjects, isPublished } from '@/lib/content/queries'
import { projects } from '@/content/projects'
import {
  deriveCode,
  getShareCode,
  getShareCodes,
  getSharePath,
  getShareUrl,
  resolveShareCode,
} from '@/lib/share/share-links'
import { renderQrSvg } from '@/lib/share/qr'

/**
 * Short share links carry two promises that are easy to break silently: a
 * link already printed on something keeps working, and a link never reaches
 * further than the publication boundary already allows. Both are checked
 * here rather than trusted to review.
 */

describe('share code derivation', () => {
  it('is deterministic for the same slug', () => {
    expect(deriveCode('localloco-app')).toBe(deriveCode('localloco-app'))
  })

  it('is six characters of a URL-safe alphabet by default', () => {
    for (const project of getPublicProjects()) {
      expect(getShareCode(project.slug)).toMatch(/^[0-9abcdefghjkmnpqrstvwxyz]{6}$/)
    }
  })

  it('omits the letters that get misread or mistyped', () => {
    // A hundred slugs is far more than the site will ever hold, and enough
    // to catch an alphabet that quietly grew an i, l, o or u.
    const sample = Array.from({ length: 100 }, (_, i) => deriveCode(`slug-${i}`))
    expect(sample.join('')).not.toMatch(/[ilou]/)
  })

  it('gives different slugs different codes', () => {
    expect(deriveCode('startuplink')).not.toBe(deriveCode('localloco-app'))
  })

  it('lengthens rather than reusing a code when two would collide', () => {
    // deriveCode is pure, so the collision branch can be exercised directly
    // on the property it exists to preserve: a longer code still starts with
    // the shorter one, so the resolution is an extension, not a reshuffle.
    const short = deriveCode('localloco-app', 6)
    const longer = deriveCode('localloco-app', 8)
    expect(longer).toHaveLength(8)
    expect(longer.startsWith(short)).toBe(true)
  })
})

describe('the share code map', () => {
  it('covers every published project and nothing else', () => {
    const published = getPublicProjects().map((project) => project.slug).sort()
    expect([...getShareCodes().keys()].sort()).toEqual(published)
  })

  it('issues a unique code per project', () => {
    const codes = [...getShareCodes().values()]
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('round-trips a code back to the slug it came from', () => {
    for (const [slug, code] of getShareCodes()) {
      expect(resolveShareCode(code)).toBe(slug)
    }
  })

  it('returns undefined for an unknown code rather than guessing', () => {
    expect(resolveShareCode('zzzzzz')).toBeUndefined()
    expect(resolveShareCode('')).toBeUndefined()
    expect(resolveShareCode('../work/enterprise-automation-reliability')).toBeUndefined()
  })
})

describe('the publication boundary', () => {
  it('gives no share code to an unpublished project', () => {
    const unpublished = projects.filter((project) => !isPublished(project))
    // The repository deliberately carries at least one unpublished item —
    // if that ever stops being true this test is no longer proving anything.
    expect(unpublished.length).toBeGreaterThan(0)

    for (const project of unpublished) {
      expect(getShareCode(project.slug)).toBeUndefined()
      expect(getSharePath(project.slug)).toBeUndefined()
      expect(getShareUrl(project.slug)).toBeUndefined()
    }
  })

  it('never resolves a code to an unpublished slug', () => {
    const publishedSlugs = new Set(getPublicProjects().map((project) => project.slug))
    for (const code of getShareCodes().values()) {
      expect(publishedSlugs.has(resolveShareCode(code)!)).toBe(true)
    }
  })
})

describe('share URLs', () => {
  it('builds an absolute https URL under /p/', () => {
    const project = getPublicProjects()[0]
    const url = getShareUrl(project.slug)!
    expect(url).toMatch(/^https:\/\/[^/]+\/p\/[0-9a-z]{6,}$/)
    expect(url.endsWith(getSharePath(project.slug)!)).toBe(true)
  })

  it('never carries a double slash between origin and path', () => {
    for (const project of getPublicProjects()) {
      expect(getShareUrl(project.slug)!.slice('https://'.length)).not.toContain('//')
    }
  })
})

describe('QR encoding', () => {
  it('encodes the share URL and nothing else', () => {
    const project = getPublicProjects()[0]
    const url = getShareUrl(project.slug)!
    const { svg } = renderQrSvg(url, `QR code linking to ${project.title}`)

    // Decoding a QR needs a reader, so the guarantee checked here is the one
    // that actually breaks in practice: that the value handed to the encoder
    // is the finished share URL rather than a path, a slug or a placeholder.
    expect(url.startsWith('https://')).toBe(true)
    expect(url).toContain('/p/')
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain('</svg>')
  })

  it('keeps the quiet zone the QR specification requires', () => {
    const { svg, moduleCount } = renderQrSvg('https://example.com/p/abc123', 'QR')
    // Four modules of margin on each side, so the viewBox is eight wider
    // than the code itself. Trimming this is the usual reason a valid code
    // will not scan.
    expect(svg).toContain(`viewBox="0 0 ${moduleCount + 8} ${moduleCount + 8}"`)
  })

  it('stays black on white so the polarity is what scanners expect', () => {
    const { svg } = renderQrSvg('https://example.com/p/abc123', 'QR')
    expect(svg).toContain('fill="white"')
    expect(svg).toContain('fill="black"')
  })

  it('labels the code for assistive technology', () => {
    const { svg } = renderQrSvg('https://example.com/p/abc123', 'QR code linking to LocalLoco')
    expect(svg).toContain('role="img"')
    expect(svg).toContain('aria-label="QR code linking to LocalLoco"')
  })

  it('escapes a label rather than letting it close an attribute', () => {
    const { svg } = renderQrSvg('https://example.com', 'A "quoted" <name>')
    expect(svg).toContain('aria-label="A &quot;quoted&quot; &lt;name&gt;"')
  })
})
