"use client"

import { useState, useMemo } from "react"
import { allProjects, getProjectStats, type ProjectStatus, type ProjectCategory } from "@/lib/all-projects"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  Smartphone, 
  Users, 
  Trophy, 
  GraduationCap, 
  Lightbulb, 
  Package, 
  Chrome,
  Gamepad2,
  MessageSquare,
  Search,
  ExternalLink,
  Github,
  Filter
} from "lucide-react"

const categoryIcons: Record<ProjectCategory, React.ReactNode> = {
  "Web App": <Globe className="h-4 w-4" />,
  "Mobile App": <Smartphone className="h-4 w-4" />,
  "Community": <Users className="h-4 w-4" />,
  "Hackathon": <Trophy className="h-4 w-4" />,
  "School": <GraduationCap className="h-4 w-4" />,
  "Concept": <Lightbulb className="h-4 w-4" />,
  "Product": <Package className="h-4 w-4" />,
  "Chrome Extension": <Chrome className="h-4 w-4" />,
  "Game": <Gamepad2 className="h-4 w-4" />,
  "CCA": <Users className="h-4 w-4" />,
  "Telegram Bot": <MessageSquare className="h-4 w-4" />
}

const statusColors: Record<ProjectStatus, string> = {
  "Active": "bg-green-500/20 text-green-400 border-green-500/50",
  "Paused": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  "MVP": "bg-blue-500/20 text-blue-400 border-blue-500/50",
  "Idea": "bg-purple-500/20 text-purple-400 border-purple-500/50",
  "Completed": "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
}

export default function AllProjects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "All">("All")
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All")
  
  const stats = getProjectStats()

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.keyTech.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchQuery, selectedStatus, selectedCategory])

  const groupedProjects = useMemo(() => {
    const groups: Record<ProjectStatus, typeof brainHistory> = {
      "Active": [],
      "Paused": [],
      "MVP": [],
      "Idea": [],
      "Completed": []
    }
    
    filteredProjects.forEach(project => {
      groups[project.status].push(project)
    })
    
    return groups
  }, [filteredProjects])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Complete{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Project Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A comprehensive collection of production applications, academic projects, and innovative concepts spanning web development, mobile apps, and community initiatives.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-green-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.active}</div>
              <div className="text-sm text-gray-400">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-yellow-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.paused}</div>
              <div className="text-sm text-gray-400">Paused</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.mvp}</div>
              <div className="text-sm text-gray-400">MVP</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{stats.idea}</div>
              <div className="text-sm text-gray-400">Ideas</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects by name, tech, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | "All")}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="MVP">MVP</option>
                  <option value="Idea">Idea</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ProjectCategory | "All")}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Community">Community</option>
                  <option value="School">School</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Product">Product</option>
                  <option value="Game">Game</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredProjects.length} of {stats.total} projects
            </div>
          </CardContent>
        </Card>

        {/* Projects by Status */}
        {(Object.keys(groupedProjects) as ProjectStatus[]).map((status) => {
          const projects = groupedProjects[status]
          if (projects.length === 0) return null

          const statusTitles: Record<ProjectStatus, string> = {
            "Active": "Active & In Production",
            "Paused": "On Hold",
            "MVP": "Minimum Viable Products",
            "Idea": "Conceptual & Planning Phase",
            "Completed": "Completed Projects"
          }

          const statusDescriptions: Record<ProjectStatus, string> = {
            "Active": "Currently deployed and operational projects serving real users",
            "Paused": "Projects temporarily on hold, available for future development",
            "MVP": "Functional prototypes demonstrating core features and concepts",
            "Idea": "Conceptual projects in planning and design phase",
            "Completed": "Successfully delivered projects and learning exercises"
          }

          return (
            <section key={status} className="mb-16">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{statusTitles[status]}</h2>
                  <Badge variant="outline" className={statusColors[status]}>
                    {projects.length}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">{statusDescriptions[status]}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                            {categoryIcons[project.category]}
                          </div>
                          <Badge variant="outline" className={statusColors[project.status]}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                          {project.category}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Tech Stack:</div>
                        <div className="text-sm text-cyan-400 line-clamp-2">
                          {project.keyTech}
                        </div>
                      </div>
                      
                      {project.notes && (
                        <div className="mb-4 p-2 bg-slate-700/30 rounded text-xs text-gray-400 italic">
                          {project.notes}
                        </div>
                      )}
                      
                      {(project.demoUrl || project.githubUrl) && (
                        <div className="flex gap-2 pt-4 border-t border-slate-700">
                          {project.demoUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                              onClick={() => window.open(project.demoUrl, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Demo
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                              onClick={() => window.open(project.githubUrl, "_blank")}
                            >
                              <Github className="h-4 w-4 mr-1" />
                              Code
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
