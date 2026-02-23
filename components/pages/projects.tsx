"use client"

import { projects } from "@/lib/projects"
import ProjectCard from "@/components/project-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Projects() {
  // Separate projects by type according to priority order
  const personalProjects = projects.filter(p => p.type === "Personal").sort((a, b) => a.priority - b.priority)
  const academicProjects = projects.filter(p => p.type === "Academic").sort((a, b) => a.priority - b.priority)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Projects</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Highlighted web systems and applications demonstrating full-stack development capabilities, system architecture design, and production deployment experience.
          </p>
        </div>

        {/* Personal Projects Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Production Applications</h2>
            <p className="text-gray-300 max-w-4xl">
              Self-initiated projects demonstrating end-to-end system development, from architecture design to production deployment. Focus on real-world problem solving and modern development practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Academic Projects Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Academic Projects</h2>
            <p className="text-gray-300 max-w-4xl">
              Coursework projects demonstrating fundamental programming concepts, object-oriented design principles, and security analysis capabilities developed through formal education.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Technical Summary */}
        <section className="mb-16">
          <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Development Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{projects.length}</div>
                  <div className="text-gray-300">Total Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{personalProjects.length}</div>
                  <div className="text-gray-300">Personal Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{academicProjects.length}</div>
                  <div className="text-gray-300">Academic Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">20+</div>
                  <div className="text-gray-300">Technologies Used</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* All Projects CTA */}
        <div className="text-center mb-8">
          <Card className="bg-gradient-to-r from-purple-900/50 to-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">View Complete Project Portfolio</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Explore all 27 projects including production applications, academic work, community initiatives, and innovative concepts.
              </p>
              <Link href="/all-projects" passHref legacyBehavior>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
                >
                  View All Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* GitHub Integration CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">View Source Code</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Explore implementation details, code architecture, and development practices through GitHub repositories for available projects.
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