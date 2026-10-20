import {
  AtSign,
  CalendarDays,
  Facebook,
  Github,
  Globe,
  Instagram,
  Link as LinkIcon,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Send,
  Share2,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'

import type { ContactKind, QuickAction, SocialNetwork } from '@/lib/card/schema'

export const CONTACT_ICONS: Record<ContactKind, LucideIcon> = {
  phone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  telegram: Send,
  website: Globe,
  address: MapPin,
}

export const SOCIAL_ICONS: Record<SocialNetwork, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  x: Twitter,
  tiktok: Music2,
  youtube: Youtube,
  facebook: Facebook,
  other: AtSign,
}

export const QUICK_ICONS: Record<QuickAction, LucideIcon> = {
  call: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  share: Share2,
}

export { CalendarDays, LinkIcon }
