"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Unlock, Lightbulb, Filter, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function VisionaryWall() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isPasswordAccepted, setIsPasswordAccepted] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: "15 + 7", answer: "22" })
  const [activeFilter, setActiveFilter] = useState("all")
  const [showDetails, setShowDetails] = useState<number[]>([])

  const startupIdeas = [
    {
      id: 1,
      title: "EcoTrack",
      miniPitch: "AI-powered carbon footprint tracking for individuals and businesses",
      stage: "ideation",
      tags: ["AI", "Sustainability", "Mobile App"],
      category: "environmental",
      detailedDescription:
        "A comprehensive platform that uses AI to track and analyze carbon footprints, providing personalized recommendations for reducing environmental impact. Features include real-time tracking, gamification, and corporate sustainability reporting.",
      targetMarket: "Environmentally conscious consumers and businesses",
      businessModel: "Freemium with premium analytics and corporate plans",
      techStack: ["React Native", "TensorFlow", "Node.js", "MongoDB"],
    },
    {
      id: 2,
      title: "SkillBridge",
      miniPitch: "Connecting students with industry mentors for real-world skill development",
      stage: "concept",
      tags: ["Education", "Networking", "Career Development"],
      category: "education",
      detailedDescription:
        "A platform that bridges the gap between academic learning and industry requirements by connecting students with experienced professionals for mentorship, project collaboration, and skill development.",
      targetMarket: "University students and recent graduates",
      businessModel: "Subscription-based with commission on successful placements",
      techStack: ["Next.js", "PostgreSQL", "WebRTC", "Stripe"],
    },
    {
      id: 3,
      title: "LocalCraft",
      miniPitch: "Marketplace for local artisans and handmade products",
      stage: "seed",
      tags: ["E-commerce", "Local Business", "Artisans"],
      category: "marketplace",
      detailedDescription:
        "An e-commerce platform specifically designed for local artisans to showcase and sell their handmade products, with features for custom orders, local delivery, and community building.",
      targetMarket: "Local artisans and craft enthusiasts",
      businessModel: "Commission-based with premium seller tools",
      techStack: ["React.js", "Stripe", "Firebase", "Google Maps API"],
    },
    {
      id: 4,
      title: "MindfulAI",
      miniPitch: "AI-powered mental health companion for personalized wellness",
      stage: "paused",
      tags: ["AI", "Mental Health", "Wellness"],
      category: "health",
      detailedDescription:
        "An AI companion that provides personalized mental health support through mood tracking, meditation guidance, and crisis intervention. Includes integration with healthcare providers.",
      targetMarket: "Individuals seeking mental health support",
      businessModel: "Subscription with healthcare partnerships",
      techStack: ["Python", "TensorFlow", "React Native", "HIPAA-compliant infrastructure"],
    },
    {
      id: 5,
      title: "CodeCollab",
      miniPitch: "Real-time collaborative coding platform for remote teams",
      stage: "ideation",
      tags: ["Developer Tools", "Collaboration", "Remote Work"],
      category: "productivity",
      detailedDescription:
        "A comprehensive platform for remote development teams featuring real-time code collaboration, integrated video calls, project management, and code review tools.",
      targetMarket: "Remote development teams and coding bootcamps",
      businessModel: "Tiered subscription based on team size",
      techStack: ["WebRTC", "Socket.io", "Monaco Editor", "Docker"],
    },
    {
      id: 6,
      title: "FoodRescue",
      miniPitch: "Connecting restaurants with food banks to reduce waste",
      stage: "success",
      tags: ["Social Impact", "Food Waste", "Logistics"],
      category: "social",
      detailedDescription:
        "A logistics platform that efficiently connects restaurants and grocery stores with food banks and charities to redistribute surplus food, reducing waste and fighting hunger.",
      targetMarket: "Restaurants, grocery stores, and food banks",
      businessModel: "B2B SaaS with impact measurement tools",
      techStack: ["React.js", "Node.js", "Google Maps API", "Twilio"],
    },
  ]

  const filters = [
    { key: "all", label: "All Ideas" },
    { key: "environmental", label: "Environmental" },
    { key: "education", label: "Education" },
    { key: "marketplace", label: "Marketplace" },
    { key: "health", label: "Health" },
    { key: "productivity", label: "Productivity" },
    { key: "social", label: "Social Impact" },
  ]

  const stageColors = {
    ideation: "from-blue-500 to-cyan-500",
    concept: "from-purple-500 to-pink-500",
    seed: "from-green-500 to-emerald-500",
    success: "from-yellow-500 to-orange-500",
    paused: "from-gray-500 to-slate-500",
  }

  const handleCaptchaSubmit = () => {
    if (captchaAnswer === captchaQuestion.answer) {
      setIsUnlocked(true)
    } else {
      alert("Incorrect answer. Please try again.")
      setCaptchaAnswer("")
    }
  }

  const toggleDetails = (ideaId: number) => {
    setShowDetails((prev) => (prev.includes(ideaId) ? prev.filter((id) => id !== ideaId) : [...prev, ideaId]))
  }

  const filteredIdeas =
    activeFilter === "all" ? startupIdeas : startupIdeas.filter((idea) => idea.category === activeFilter)

  if (!isPasswordAccepted) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Visionary Wall Password</h2>
              <p className="text-gray-300 mb-6">
                This section is protected. Please enter the password provided by Mohamed Aslam to continue.
              </p>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-slate-600 border-cyan-500/30 text-white mb-4"
                onKeyDown={e => { if (e.key === "Enter") {
                  if (password === "thefutureinnov") {
                    setIsPasswordAccepted(true); setPasswordError("");
                  } else {
                    setPasswordError("Incorrect password. Please try again.");
                  }
                }}}
              />
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 mb-2"
                onClick={() => {
                  if (password === "thefutureinnov") {
                    setIsPasswordAccepted(true); setPasswordError("");
                  } else {
                    setPasswordError("Incorrect password. Please try again.");
                  }
                }}
              >
                Unlock
              </Button>
              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Visionary Wall Access</h2>
              <p className="text-gray-300 mb-6">
                This section contains my innovative startup ideas and concepts. Please solve the captcha to unlock
                access and prevent AI intrusion.
              </p>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <p className="text-cyan-400 font-semibold mb-2">Human Verification:</p>
                <p className="text-white text-lg mb-4">What is {captchaQuestion.question}?</p>
                <Input
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="bg-slate-600 border-cyan-500/30 text-white mb-4"
                  onKeyPress={(e) => e.key === "Enter" && handleCaptchaSubmit()}
                />
                <Button
                  onClick={handleCaptchaSubmit}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock Visionary Wall
                </Button>
              </div>

              <p className="text-gray-400 text-sm">
                This verification helps ensure human access to protect innovative ideas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Unlock className="h-8 w-8 text-green-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Visionary{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Wall</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Welcome to my innovation laboratory! Here you'll find startup ideas and concepts that I'm passionate about
            building. Each idea represents a potential solution to real-world problems.
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

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stageColors[idea.stage as keyof typeof stageColors]} flex items-center justify-center`}
                  >
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      idea.stage === "success"
                        ? "border-green-500/50 text-green-400"
                        : idea.stage === "seed"
                          ? "border-yellow-500/50 text-yellow-400"
                          : idea.stage === "concept"
                            ? "border-purple-500/50 text-purple-400"
                            : idea.stage === "paused"
                              ? "border-gray-500/50 text-gray-400"
                              : "border-blue-500/50 text-blue-400"
                    }`}
                  >
                    {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
                  </Badge>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {idea.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{idea.miniPitch}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Detailed View Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleDetails(idea.id)}
                  className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                >
                  {showDetails.includes(idea.id) ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </>
                  )}
                </Button>

                {/* Detailed Information */}
                {showDetails.includes(idea.id) && (
                  <div className="mt-4 pt-4 border-t border-cyan-500/20">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-1">Description:</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">{idea.detailedDescription}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-1">Target Market:</h4>
                        <p className="text-gray-300 text-xs">{idea.targetMarket}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-1">Business Model:</h4>
                        <p className="text-gray-300 text-xs">{idea.businessModel}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-1">Tech Stack:</h4>
                        <div className="flex flex-wrap gap-1">
                          {idea.techStack.map((tech, index) => (
                            <Badge key={index} variant="outline" className="border-green-500/50 text-green-400 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Innovation Stats */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Innovation Pipeline</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {startupIdeas.filter((idea) => idea.stage === "ideation").length}
                  </div>
                  <div className="text-gray-300">Ideation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {startupIdeas.filter((idea) => idea.stage === "concept").length}
                  </div>
                  <div className="text-gray-300">Concept</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {startupIdeas.filter((idea) => idea.stage === "seed").length}
                  </div>
                  <div className="text-gray-300">Seed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {startupIdeas.filter((idea) => idea.stage === "success").length}
                  </div>
                  <div className="text-gray-300">Success</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-400 mb-2">
                    {startupIdeas.filter((idea) => idea.stage === "paused").length}
                  </div>
                  <div className="text-gray-300">Paused</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
