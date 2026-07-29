"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Video, Users, Rocket, Palette } from "lucide-react"
import { useState } from "react"

type SkillCategory = "technical" | "soft" | "creative" | "entrepreneurship" | "video-editing"

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("technical")

  const skillCategories: Record<SkillCategory, {
    title: string
    icon: React.ReactNode
    color: string
    skills: Array<{ name: string; level: number; description: string }>
  }> = {
    technical: {
      title: "Technical Skills",
      icon: <Code className="h-6 w-6" />,
      color: "from-cyan-500 to-blue-500",
      skills: [
        { name: "HTML5, CSS3", level: 95, description: "Core web technologies for building and styling." },
        { name: "Tailwind CSS", level: 95, description: "Utility-first CSS framework for rapid UI development." },
        { name: "JavaScript", level: 90, description: "From basics to intermediate concepts." },
        { name: "Next.js", level: 90, description: "React framework for production applications." },
        { name: "React", level: 90, description: "Building dynamic UIs with components and hooks." },
        { name: "Firebase", level: 90, description: "Authentication, database, and storage solutions." },
        { name: "Supabase", level: 90, description: "Open-source Firebase alternative." },
        { name: "PostgreSQL", level: 85, description: "Powerful object-relational database system." },
        { name: "Git & GitHub", level: 95, description: "Version control and collaborative development." },
        { name: "Figma", level: 90, description: "UI design and prototyping." },
        { name: "SQL", level: 80, description: "Database queries and CRUD operations." },
        { name: "Stored Procedures", level: 75, description: "PostgreSQL database logic." },
        { name: "FastAPI", level: 70, description: "Python backend framework." },
        { name: "SWR", level: 75, description: "React Hooks for data fetching." },
        { name: "React Context API", level: 75, description: "Global state management." },
        { name: "Java", level: 60, description: "Academic projects and OOP." },
        { name: "Python", level: 45, description: "Scripting and automation." },
        { name: "Secure Coding & OWASP Top 10", level: 40, description: "Security best practices." },
      ],
    },
    soft: {
      title: "Soft & Leadership",
      icon: <Users className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Team Collaboration", level: 95, description: "Working effectively in team environments." },
        { name: "Project Leadership", level: 90, description: "Leading projects and teams to success." },
        { name: "Communication & Presentation", level: 95, description: "Clearly conveying ideas and information." },
        { name: "Problem Solving", level: 95, description: "Finding effective solutions to complex problems." },
        { name: "Adaptability", level: 90, description: "Adjusting to new situations and challenges." },
        { name: "Critical Thinking", level: 85, description: "Analyzing information to make sound judgments." },
        { name: "Time Management", level: 85, description: "Prioritizing tasks and meeting deadlines." },
        { name: "Public Speaking", level: 80, description: "Presenting to audiences with confidence." },
        { name: "Mentoring", level: 80, description: "Guiding and supporting team members." },
        { name: "Conflict Resolution", level: 75, description: "Mediating and resolving disagreements." },
      ],
    },
    creative: {
      title: "Creative & Community",
      icon: <Palette className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-500",
      skills: [
        { name: "UI/UX Design Thinking", level: 90, description: "Designing user-centered digital experiences." },
        { name: "Branding & Visual Consistency", level: 85, description: "Creating consistent brand identities." },
        { name: "Poster & Content Creation", level: 85, description: "Designing visuals for marketing." },
        { name: "Content Writing", level: 85, description: "Creating engaging written content." },
        { name: "Community Engagement", level: 80, description: "Building and nurturing communities." },
        { name: "Event Planning", level: 80, description: "Organizing and coordinating events." },
        { name: "Social Media Strategy", level: 75, description: "Planning social media campaigns." },
      ],
    },
    entrepreneurship: {
      title: "Entrepreneurship",
      icon: <Rocket className="h-6 w-6" />,
      color: "from-red-500 to-pink-500",
      skills: [
        { name: "Startup Ideation", level: 95, description: "Generating and developing business ideas." },
        { name: "MVP Planning & Development", level: 90, description: "Creating minimum viable products." },
        { name: "Market Research", level: 85, description: "Understanding customer needs and trends." },
        { name: "Pitching & Storytelling", level: 85, description: "Crafting compelling narratives." },
        { name: "Business Model Design", level: 80, description: "Creating sustainable revenue models." },
        { name: "Customer Validation", level: 75, description: "Testing assumptions with real customers." },
      ],
    },
    "video-editing": {
      title: "Video Editing",
      icon: <Video className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "CapCut", level: 90, description: "Professional video editing and effects." },
        { name: "Keyframe Editing", level: 75, description: "Creating engaging transitions and animations." },
        { name: "Adobe Premiere Pro", level: 70, description: "Advanced video editing and post-production." },
        { name: "Montage Editing", level: 65, description: "Creative montages for events and content." },
      ],
    },
  }

  const currentCategory = skillCategories[activeCategory]
  const topSkills = currentCategory.skills.slice(0, 6)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Expertise
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical abilities, creative skills, and leadership capabilities.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {(Object.keys(skillCategories) as SkillCategory[]).map((key) => {
              const category = skillCategories[key]
              const isActive = activeCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`group relative p-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${category.color} shadow-lg scale-105`
                      : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-cyan-400"} transition-colors`}>
                      {category.icon}
                    </div>
                    <span className={`text-sm font-semibold text-center ${isActive ? "text-white" : "text-gray-300"}`}>
                      {category.title}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Category Overview Card */}
          <Card className="lg:col-span-1 bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentCategory.color} flex items-center justify-center mb-6 mx-auto`}>
                <div className="text-white text-3xl">
                  {currentCategory.icon}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                {currentCategory.title}
              </h2>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-1">
                    {currentCategory.skills.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Skills</div>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-sm text-gray-400 mb-2">Top Skills:</div>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="border-cyan-500/50 text-cyan-400 text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
              All {currentCategory.title}
            </h3>
            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {currentCategory.skills.map((skill, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`border-cyan-500/50 ${
                          skill.level >= 85 ? "text-green-400 border-green-500/50" :
                          skill.level >= 70 ? "text-cyan-400 border-cyan-500/50" :
                          "text-yellow-400 border-yellow-500/50"
                        }`}
                      >
                        {skill.level}%
                      </Badge>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="mb-3 h-2"
                    />
                    <p className="text-gray-400 text-sm leading-relaxed">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Summary Stats */}
        <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Overall Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">18+</div>
                <div className="text-gray-300 text-sm">Technical Skills</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">10+</div>
                <div className="text-gray-300 text-sm">Leadership Skills</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">7+</div>
                <div className="text-gray-300 text-sm">Creative Skills</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400 mb-2">6+</div>
                <div className="text-gray-300 text-sm">Business Skills</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">4+</div>
                <div className="text-gray-300 text-sm">Video Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
