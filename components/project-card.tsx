"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { Project } from "@/lib/projects"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.name}
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
            {project.status === "completed" ? "Completed" : "Active"}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
            {project.type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-cyan-400 font-medium">{project.role}</p>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">{project.systemDescription}</p>

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Tech Stack:</h4>
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                {tech.name}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                +{project.techStack.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Technical Highlights:</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            {project.technicalHighlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.links.github && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white"
              onClick={() => window.open(project.links.github!, "_blank")}
            >
              <Github className="h-4 w-4 mr-2" />
              Code
            </Button>
          )}
          {project.links.demo && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              onClick={() => window.open(project.links.demo, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Demo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}