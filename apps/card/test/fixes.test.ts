import { z } from 'zod'

import { formatSgTime, leadsToCsv } from '@/lib/card/csv'
import { newCard, newWidget } from '@/lib/card/defaults'
import { describeIssue } from '@/lib/card/issues'
import { cardSchema } from '@/lib/card/schema'

describe('inbox CSV', () => {
  it('handles created_at as a Date, which crashed the first version', () => {
    const csv = leadsToCsv([
      { created_at: new Date('2026-10-21T07:15:00Z'), fields: { name: 'QA Visitor', email: 'qa@example.com' } },
    ])
    const [header, row] = csv.trim().split('\r\n')
    expect(header).toBe('created_at,name,designation,company,email,mobile,message')
    expect(row).toBe('"2026-10-21T07:15:00.000Z","QA Visitor","","","qa@example.com","",""')
  })

  it('still neutralises spreadsheet formulas', () => {
    const csv = leadsToCsv([{ created_at: '2026-10-21T07:15:00Z', fields: { name: '=HYPERLINK("x")' } }])
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`)
  })

  it('shows submission times in Singapore time, not UTC', () => {
    expect(formatSgTime(new Date('2026-10-21T07:15:00Z'))).toMatch(/3:15\s?pm/i)
  })
})

describe('editor error messages', () => {
  it('names the block instead of a schema path', () => {
    const doc = newCard('A B')
    const link = newWidget('link')
    doc.widgets = [newWidget('heading'), link]
    const result = cardSchema.safeParse(doc)
    expect(result.success).toBe(false)
    const message = describeIssue((result as { error: z.ZodError }).error, doc)
    expect(message).toMatch(/^Block 2 \(Link button\): /)
    expect(message).not.toContain('widgets.')
  })

  it('names profile fields the way the editor labels them', () => {
    const doc = newCard('A B')
    doc.header.email = 'not-an-email'
    const result = cardSchema.safeParse(doc)
    expect(describeIssue((result as { error: z.ZodError }).error, doc)).toMatch(/^Profile → Email: /)
  })
})
