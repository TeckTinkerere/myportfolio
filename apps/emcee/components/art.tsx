import {
  CommunityIllustration,
  ConversationIllustration,
  HackathonIllustration,
  MicIllustration,
  NetworkIllustration,
  RunSheetIllustration,
  WorkshopIllustration,
} from '@mohdaslam/ui/illustrations'

const ART = {
  mic: MicIllustration,
  hackathon: HackathonIllustration,
  network: NetworkIllustration,
  workshop: WorkshopIllustration,
  community: CommunityIllustration,
  conversation: ConversationIllustration,
  runsheet: RunSheetIllustration,
} as const

export type Art = keyof typeof ART

export function Illustration({ art, className }: { art: Art; className?: string }) {
  const Component = ART[art]
  return <Component className={className} />
}
