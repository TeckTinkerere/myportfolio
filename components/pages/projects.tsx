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
      features: ["Student networking", "Event Finding", "Project collaboration", "Resource sharing","Founder-led", "Ecosystem building", "Student collaboration", "Project Collaboration"],
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
                onClick={() => window.open("https://github.com/mohamedaslam", "_blank")}
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
