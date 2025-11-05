"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Filter } from "lucide-react"
import { useState } from "react"

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all")

  const projects = [
    {
      id: 2,
      title: "StartupLink",
      description: "Mission: To bridge the gap between student talent and verified student-led startups through a secure, community-driven platform. Idea: StartupLink connects ambitious students with founders of early-stage startups, helping both sides grow through collaboration, internships, and project opportunities.",
      image: "/startuplinkmvp.png",
      tags: ["Next.js 14", "Tailwind CSS", "Firebase", "SWR", "React Context"],
      category: "startup",
      status: "active",
      github: "https://github.com/mohamedaslam/polystart-connect",
      demo: "https://v0-poly-start-connect.vercel.app/",
      features: ["Firebase-based authentication and role system", "Founder onboarding using verified company emails", "Job/hiring board with application tracking", "Student profile pages with skill showcases", "In-app messaging between startups and applicants", "Events page for startup-related opportunities", "Dynamic role-based navigation", "Light/dark mode toggle for better UX"],
    },
    {
      id: 1,
      title: "LocalLoco",
      description: "Mission: To revive and strengthen local business ecosystems in Singapore by connecting residents with real-time neighborhood deals. Idea: LocalLoco is a hyperlocal web app that gives small businesses visibility through community-driven deal sharing and volunteer contributions, making local shopping more rewarding.",
      image: "/locallocomvp.png",
      tags: ["Next.js", "Tailwind CSS", "FastAPI", "PostgreSQL", "Supabase"],
      category: "startup",
      status: "active",
      github: "https://github.com/mohamedaslam/local-loco",
      demo: "https://v0-local-loco-website.vercel.app/",
      features: ["Mobile-first PWA interface", "Browse real-time promotions and nearby deals", "Volunteer-submitted deal injection with admin moderation", "QR and receipt-based redemption tracking", "Planned shop-owner onboarding system", "Community-friendly “Lucky Draw” system"],
    },
    {
      id: 6,
      title: "Recenter",
      description: "Mission: To help students manage stress and mental well-being through mindfulness and journaling. Idea: A minimalist meditation and journaling web app designed for focus, calm, and mental clarity—built during a period of academic pressure.",
      image: "/Recenter.png",
      tags: ["React.js", "Wellness", "UI/UX"],
      category: "self-project",
      status: "completed",
      github: null,
      demo: "https://v0-recenter.vercel.app/",
      features: ["Guided meditation interface", "Personal journal creation and editing", "Community story posts with “like” interactions", "Local and cloud modes for journaling", "Adaptive dark/light theme"],
    },
    {
      id: 7,
      title: "Online Shopping System (CA1 Project)",
      description: "Mission: To design a database-backed e-commerce system demonstrating proficiency in PostgreSQL, stored procedures, and CRUD operations. Idea: A full-featured shopping platform where users can browse products, add to cart, and review purchases—all supported by stored procedures for database logic.",
      image: "/placeholder.svg",
      tags: ["PostgreSQL", "Stored Procedures", "CRUD"],
      category: "school",
      status: "completed",
      github: null,
      demo: null,
      features: ["CRUD operations for reviews, comments, and sales orders", "Role-based access (admin, user)", "Integration between front-end and back-end"],
    },
    {
      id: 8,
      title: "Mini Library System (ST0509 Java Assignment 1)",
      description: "Mission: To build a modular student management system using Java fundamentals. Idea: A console-based application to manage students, books, and borrowing functions, forming part of a collaborative team project.",
      image: "/placeholder.svg",
      tags: ["Java", "OOP", "Team Project"],
      category: "school",
      status: "completed",
      github: null,
      demo: null,
      features: ["Student registration, search, and data updates", "Borrowing and returning book tracking", "Menu-driven user interface"],
    },
    {
      id: 9,
      title: "Freelance Academy Resource Hub (KreatorsNest)",
      description: "Mission: To empower freelancers and creators with centralized learning resources and guides. Idea: A web-based resource hub inspired by your role in Freelance Academy, promoting self-learning and freelancing awareness among students.",
      image: "/placeholder.svg",
      tags: ["HTML", "CSS", "JavaScript", "Netlify"],
      category: "self-project",
      status: "completed",
      github: null,
      demo: "https://kreatorsnest.netlify.app/",
      features: ["Curated resources and tutorials", "Minimalist design and easy navigation", "Static content hub"],
    },
    {
      id: 10,
      title: "Freelance Academy Website (CCA Project)",
      description: "Mission: To support event promotion and member engagement within the Freelance Academy CCA. Idea: A clean, modern web presence showcasing the academy’s initiatives, events, and resources.",
      image: "/placeholder.svg",
      tags: ["Web Development", "CCA", "Community"],
      category: "team-based",
      status: "completed",
      github: null,
      demo: null,
      features: ["Event listings and registration section", "Team and project highlights", "Optimized navigation for clarity"],
    },
    {
      id: 11,
      title: "SPCyclists Website (CCA Project)",
      description: "Mission: To streamline logistics and showcase the cycling community at Singapore Polytechnic. Idea: A simple, functional site highlighting the club’s activities and logistical information.",
      image: "/placeholder.svg",
      tags: ["Web Development", "CCA", "Logistics"],
      category: "team-based",
      status: "completed",
      github: null,
      demo: null,
      features: ["Event schedule display", "Club announcements", "Gear and logistics updates"],
    },
    {
      id: 12,
      title: "Secure Coding Vulnerability Analysis (ST2515)",
      description: "Mission: To identify and mitigate OWASP Top 10 vulnerabilities in a given web application. Idea: A professional-style security assessment and report to enhance secure coding habits.",
      image: "/placeholder.svg",
      tags: ["Cybersecurity", "OWASP Top 10", "Secure Coding"],
      category: "school",
      status: "completed",
      github: null,
      demo: null,
      features: ["Analysis of injection flaws, authentication issues, and XSS vulnerabilities", "Recommendations and code fixes", "Live demo presentation"],
    },
    {
      id: 13,
      title: "Sustainability & Recycling Initiative (IMYouthSG)",
      description: "Mission: To raise environmental awareness and encourage community recycling participation. Idea: A youth-driven initiative supported by IMYouthSG, spreading environmental action messages through posters, Telegram posts, and community events.",
      image: "/placeholder.svg",
      tags: ["Advocacy", "Community", "Sustainability"],
      category: "team-based",
      status: "completed",
      github: null,
      demo: null,
      features: ["Community engagement", "Environmental awareness campaigns", "Youth-led initiative"],
    },
    {
      id: 14,
      title: "AI For Good (Youth)",
      description: "Certified AI For Good (Youth) Facilitator with AI Singapore through SYAI (Singapore Youth AI) for teaching secondary school students about the ethical way to use AI. Participant in NUS-Guru Network AI Innovation Challenge where I created a movie content creation web app with script generation, voice/video/image generation for trailers and preview and inspiration.",
      image: "/AIBootcamp.png",
      tags: ["AI", "Education", "Community", "Facilitator"],
      category: "ai",
      status: "completed",
      github: null,
      demo: null,
      features: ["AI ethics education", "Youth facilitation", "AI Innovation Challenge participant", "Content creation web app"],
    },
    {
      id: 3,
      title: "AI Prototyping & Hackathons",
      description: "AI prototyping using Hugging Face API on Google Cloud. Finalist in SP Batey Hackathon 2024, participant in Youth Action Challenge S6 and NUS GURU AI competition.",
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
      description: "A futuristic portfolio website showcasing my journey from academic struggles to tech excellence. Features interactive animations, dark/light themes, and responsive design.",
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
      description: "A comprehensive event management platform for Freelance Academy events. Handles registration, scheduling, notifications, and analytics.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Next.js", "PostgreSQL", "Prisma", "Stripe"],
      category: "self-projects",
      status: "in-progress",
      github: "https://github.com/mohamedaslam/event-management",
      demo: "https://events-demo.vercel.app",
      features: ["Event registration", "Payment processing", "Email notifications", "Analytics dashboard"],
    },
  ]

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "self-project", label: "Self Projects" },
    { key: "team-based", label: "Team Projects" },
    { key: "school", label: "School Projects" },
    { key: "startup", label: "Startup Projects" },
    { key: "ai", label: "AI Projects" },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Projects</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my development journey, featuring real-world applications, collaborative projects, and
            innovative solutions that demonstrate my growth and expertise.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg scale-105"
                  : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-cyan-500/20"
              }`}
            >
              <Filter className="h-4 w-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="outline"
                    className={`${
                      project.status === "completed"
                        ? "border-green-500/50 text-green-400"
                        : "border-orange-500/50 text-orange-400"
                    }`}
                  >
                    {project.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Key Features:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                      onClick={() => window.open(project.github!, "_blank")}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                  )}
                  {project.demo && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      onClick={() => window.open(project.demo, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GitHub Integration CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Explore More on GitHub</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Visit my GitHub profile to see additional projects, contributions, and code samples that showcase my
                development journey and technical expertise.
              </p>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
                onClick={() => window.open("https://github.com/TeckTinkerere", "_blank")}
              >
                <Github className="h-5 w-5 mr-2" />
                View GitHub Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
