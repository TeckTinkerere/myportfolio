import {
  BrowserIllustration,
  ChecklistIllustration,
  CodeIllustration,
  CommunityIllustration,
  HackathonIllustration,
  MicIllustration,
  NetworkIllustration,
  WorkshopIllustration,
} from '@mohdaslam/ui/illustrations'

import type { EventRole, PortfolioLens } from '@/lib/content/schema'

/**
 * One picture per capability and per event role, so the same subject is
 * drawn the same way wherever it appears on the site.
 */
export const LENS_ART: Partial<Record<PortfolioLens, React.ComponentType<{ className?: string }>>> = {
  software: CodeIllustration,
  websites: BrowserIllustration,
  events: MicIllustration,
  community: CommunityIllustration,
}

export const ROLE_ART: Record<EventRole, React.ComponentType<{ className?: string }>> = {
  'host-emcee': MicIllustration,
  'co-host-organiser': NetworkIllustration,
  'workshop-instructor': WorkshopIllustration,
  'facilitator-teaching-assistant': HackathonIllustration,
  'event-operations-support': ChecklistIllustration,
}
