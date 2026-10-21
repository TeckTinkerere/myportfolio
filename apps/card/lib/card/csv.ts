/**
 * Contact-form submissions as CSV, for the inbox download.
 *
 * created_at may arrive as a Date (the Neon driver parses timestamptz) or a
 * string; both become an ISO timestamp. Passing a Date straight into the
 * cell escaper is what made the first version of this route throw.
 */
export const LEAD_COLUMNS = ['created_at', 'name', 'designation', 'company', 'email', 'mobile', 'message'] as const

export interface CsvLead {
  created_at: string | Date
  fields: Record<string, string>
}

/** CSV-escape, and neutralise spreadsheet formula injection. */
export function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export function leadsToCsv(leads: CsvLead[]): string {
  const rows = [LEAD_COLUMNS.join(',')]
  for (const lead of leads) {
    rows.push(
      LEAD_COLUMNS.map((c) =>
        csvCell(c === 'created_at' ? new Date(lead.created_at).toISOString() : String(lead.fields[c] ?? '')),
      ).join(','),
    )
  }
  return rows.join('\r\n') + '\r\n'
}

/** A submission time as people in Singapore read it, e.g. "21 Oct 2026, 3:15 pm". */
export function formatSgTime(value: string | Date): string {
  return new Date(value).toLocaleString('en-SG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Singapore',
  })
}
