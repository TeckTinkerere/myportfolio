export type Project = {
  id: number
  title: string
  description: string
  image?: string | null
  tags: string[]
  category?: string
  status?: string
  github?: string | null
  demo?: string | null
  features: string[]
}

export const projects: Project[] = [
  {
    id: 0,
    title: "StartupLink (PolyStart Connect)",
    description:
      "Student–startup collaboration platform with multi-step signup, founder verification, and role-based navigation. Built with Next.js, Tailwind CSS, and Firebase.",
    image: "/startuplinkmvp.png",
    tags: ["Next.js", "Tailwind CSS", "Firebase", "UX"],
    category: "startup",
    status: "private",
    github: null,
    demo: null,
    features: ["Multi-step signup", "Founder verification", "Role-based navigation"],
  },
  {
    id: 1,
    title: "LocalLoco",
    description:
      "A student-led startup empowering SMEs and social enterprises with digital solutions. Led MVP development, agile team coordination, and user-driven iteration. Recognized in national competitions.",
    image: "/locallocomvp.png",
    tags: ["React.js", "Node.js", "Express", "Startup", "Leadership"],
    category: "startup",
    status: "active",
    github: "https://github.com/mohamedaslam/local-loco",
    demo: "https://v0-local-loco-website.vercel.app/",
    features: ["MVP development", "Agile team leadership", "User feedback iteration", "Digital inclusion"],
  },
  {
    id: 2,
    title: "PolyStart Connect (StartupLink)",
    description:
      "A collaboration hub for polytechnic student founders to discover, verify, and connect with other legit startups. Helps avoid time-wasting or scammy connections.",
    image: "/startuplinkmvp.png",
    tags: ["React.js", "Startup", "Community", "Leadership"],
    category: "startup",
    status: "active",
    github: "https://github.com/mohamedaslam/polystart-connect",
    demo: "https://v0-poly-start-connect.vercel.app/",
    features: [
      "Student networking",
      "Event Finding",
      "Project collaboration",
      "Resource sharing",
      "Founder-led",
      "Ecosystem building",
    ],
  },
  {
    id: 3,
    title: "AI Prototyping & Hackathons",
    description:
      "AI prototyping using Hugging Face API on Google Cloud. Finalist in SP Batey Hackathon 2024, participant in Youth Action Challenge S6 and NUS GURU AI competition.",
    image: "/nusgurucomp.png",
    tags: ["AI", "Hackathon", "Hugging Face", "Google Cloud"],
    category: "ai",
    status: "completed",
    github: null,
    demo: "https://v0-nusguru.vercel.app/",
    features: ["AI prototyping", "Hackathon participant", "Cloud deployment"],
  },
  {
    id: 4,
    title: "Portfolio Website v2",
    description:
      "A futuristic portfolio website showcasing my journey from academic struggles to tech excellence. Features interactive animations, dark/light themes, and responsive design.",
    image: "/portfoliov2.png?height=300&width=400",
    tags: ["React.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    category: "self-project",
    status: "in-progress",
    github: "https://github.com/mohamedaslam/portfolio-v2",
    demo: "https://mohamedaslam.dev",
    features: ["Futuristic design", "Interactive animations", "Theme switching", "Mobile responsive"],
  },
  {
    id: 5,
    title: "CCA Event Management System",
    description:
      "A comprehensive event management platform for Freelance Academy events. Handles registration, scheduling, notifications, and analytics.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["Next.js", "PostgreSQL", "Prisma", "Stripe"],
    category: "self-projects",
    status: "in-progress",
    github: "https://github.com/mohamedaslam/event-management",
    demo: "https://events-demo.vercel.app",
    features: ["Event registration", "Payment processing", "Email notifications", "Analytics dashboard"],
  },
  {
    id: 6,
    title: "Recenter",
    description: "A meditation and calming app for quick resets, breathing, and reflection.",
    image: "/Recenter.png",
    tags: ["React.js", "Wellness", "UI/UX"],
    category: "self-project",
    status: "completed",
    github: null,
    demo: "https://v0-recenter.vercel.app/",
    features: ["Guided breathing", "Reflection prompts", "Creative drawing canvas", "Modern calming UI", "Journalling"],
  },
  
]

export default projects
