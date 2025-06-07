"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Video, Users, Lightbulb } from "lucide-react"
import { useState } from "react"

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("web-dev")

  const skillCategories = {
    "web-dev": {
      title: "Web & Frontend Development",
      icon: <Code className="h-6 w-6" />,
      color: "from-cyan-500 to-blue-500",
      skills: [
        { name: "HTML/CSS/JS", level: 95, description: "Semantic markup, responsive styling, and modern JavaScript (ES6+)" },
        { name: "React.js", level: 90, description: "Building dynamic and interactive user interfaces" },
        { name: "Node.js & Express", level: 85, description: "Backend development and RESTful API design" },
        { name: "SQL", level: 80, description: "Relational database design and queries" },
        { name: "Python (Basic)", level: 60, description: "Scripting and AI prototyping" },
        { name: "RESTful APIs", level: 80, description: "API integration and backend communication" },
      ],
    },
    "video-editing": {
      title: "Video Editing",
      icon: <Video className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "CapCut", level: 90, description: "Professional video editing and effects" },
        { name: "Adobe Premiere Pro", level: 70, description: "Advanced video editing and post-production" },
        { name: "Keyframe editing", level: 75, description: "Creating engaging transitions using keyframe in Capcut and Adobe" },
        { name: "Montage Editor", level: 65, description: "A creative edit of different montages for class and camps." },
      ],
    },
    soft: {
      title: "Soft Skills & Leadership with Entrepreneurship",
      icon: <Users className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Communication", level: 92, description: "Effective verbal and written communication" },
        { name: "Startup Ideation", level: 85, description: "Identifying market opportunities and solutions" },
        { name: "Problem Solving", level: 90, description: "Creative approaches to complex challenges" },
        { name: "Design Thinking", level: 80, description: "User-centered design methodology" },
        { name: "Market Research", level: 75, description: "Understanding user needs and market trends" },
        { name: "Prototyping", level: 78, description: "Rapid iteration and concept validation" },
      ],
    },
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Expertise
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive overview of my technical abilities, creative skills, and leadership capabilities developed
            through hands-on experience and continuous learning.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(skillCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                  : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-cyan-500/20"
              }`}
            >
              {category.icon}
              {category.title}
            </button>
          ))}
        </div>

        {/* Skills Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {skillCategories[activeCategory as keyof typeof skillCategories].title}
            </h2>
            {skillCategories[activeCategory as keyof typeof skillCategories].skills.map((skill, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                      {skill.level}%
                    </Badge>
                  </div>
                  <Progress value={skill.level} className="mb-3 h-2" />
                  <p className="text-gray-300 text-sm">{skill.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual Representation */}
          <div className="flex items-center justify-center">
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm w-full h-96">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-r ${skillCategories[activeCategory as keyof typeof skillCategories].color} flex items-center justify-center mb-6 animate-pulse`}
                >
                  <div className="text-white text-4xl">
                    {skillCategories[activeCategory as keyof typeof skillCategories].icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">
                  {skillCategories[activeCategory as keyof typeof skillCategories].title}
                </h3>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {skillCategories[activeCategory as keyof typeof skillCategories].skills
                    .slice(0, 4)
                    .map((skill, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{skill.level}%</div>
                        <div className="text-sm text-gray-300">{skill.name}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Summary */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Skills Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">6+</div>
                  <div className="text-gray-300">Web Technologies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">5+</div>
                  <div className="text-gray-300">Video Tools</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">3</div>
                  <div className="text-gray-300">Leadership Roles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">10+</div>
                  <div className="text-gray-300">Projects Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
