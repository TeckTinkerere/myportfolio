import { parseRecognition, type RecognitionInput } from '@/lib/content/schema'

/**
 * Third-party recognition: dated, attributable, verifiable by the issuer.
 *
 * The PRD does not mention certificates, but PRD s3.4 asks every claim to be
 * backed by evidence, and these are among the strongest evidence available —
 * placements awarded by named organisations on known dates. They are kept
 * separate from projects because they prove recognition, not authorship.
 *
 * Competitive placements are marked with `placement`. Course completions are
 * not, so an attendance certificate is never presented as an award.
 */
const recognitionList: RecognitionInput[] = [
  {
    slug: 'youth-action-challenge-season-6',
    title: 'Youth Action Challenge, Season 6',
    issuer: 'National Youth Council',
    date: '2025-03-15',
    placement: '1st place',
    summary:
      'Awarded first place for a technology-driven solution addressing a youth and community problem.',
    image: {
      src: '/images/certificates/YACS.png',
      alt: 'Youth Action Challenge Season 6 certificate awarded by the National Youth Council',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'sp-batey-hackathon-2024',
    title: 'Batey Hackathon 2024',
    issuer: 'Singapore Polytechnic',
    date: '2024-09-10',
    placement: '2nd place',
    summary: 'Awarded second place for full-stack web development and teamwork.',
    image: {
      src: '/images/certificates/Batey.png',
      alt: 'Batey Hackathon 2024 certificate awarded by Singapore Polytechnic',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'ai-for-good-youth-student-facilitator',
    title: 'AI for Good (Youth) — Student Facilitator',
    issuer: 'AI Singapore',
    date: '2025-04-15',
    placement: '3rd place',
    summary:
      'Recognised for leadership and facilitation on AI-driven social impact projects.',
    image: {
      src: '/images/certificates/AITrainer.png',
      alt: 'AI for Good (Youth) Student Facilitator certificate issued by AI Singapore',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'ai-for-good-youth-train-the-trainer',
    title: 'AI for Good (Youth) — Train-the-Trainer Programme',
    issuer: 'AI Singapore',
    date: '2025-04-18',
    summary:
      'Completed the programme covering AI education and facilitation for youth audiences.',
    image: {
      src: '/images/certificates/AIBootcamp.png',
      alt: 'AI for Good (Youth) Train-the-Trainer Programme certificate issued by AI Singapore',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'kotlin-essential-training',
    title: 'Kotlin Essential Training: Object-Oriented and Async Code',
    issuer: 'LinkedIn Learning',
    date: '2025-05-15',
    image: {
      src: '/images/certificates/kotlinessential.png',
      alt: 'Kotlin Essential Training certificate from LinkedIn Learning',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'leadership-foundations',
    title: 'Leadership Foundations: Leadership Styles and Models',
    issuer: 'LinkedIn Learning',
    date: '2025-05-03',
    image: {
      src: '/images/certificates/leadership1.png',
      alt: 'Leadership Foundations certificate from LinkedIn Learning',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'motivating-others-through-meaning',
    title: 'How Leaders Can Motivate Others by Creating Meaning',
    issuer: 'LinkedIn Learning',
    date: '2025-05-26',
    image: {
      src: '/images/certificates/motivateothers.png',
      alt: 'Certificate for How Leaders Can Motivate Others by Creating Meaning, from LinkedIn Learning',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
  {
    slug: 'developing-credibility-as-a-leader',
    title: 'Developing Credibility as a Leader',
    issuer: 'LinkedIn Learning',
    date: '2025-06-01',
    image: {
      src: '/images/certificates/developleader.png',
      alt: 'Developing Credibility as a Leader certificate from LinkedIn Learning',
      permissionStatus: 'not-required',
    },
    permissionStatus: 'not-required',
  },
]

export const recognition = parseRecognition(recognitionList)

/** Competitive results only — used for the homepage evidence strip. */
export const placements = recognition.filter((item) => item.placement)
