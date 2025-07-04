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
  // Math-only captcha questions for variety
  const captchaQuestions = [
    { question: "15 + 7", answer: "22" },
    { question: "9 - 3", answer: "6" },
    { question: "5 x 3", answer: "15" },
    { question: "12 + 8", answer: "20" },
    { question: "18 - 4", answer: "14" },
    { question: "7 + 6", answer: "13" },
    { question: "18 + 7", answer: "25" },
    { question: "3 x 7", answer: "21" },
    { question: "14 - 9", answer: "5" },
    { question: "8 + 11", answer: "19" },
  ];
  // Pick a random question on mount or as needed
  const [captchaQuestion, setCaptchaQuestion] = useState(
    captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)]
  );
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
      stage: "Ideation",
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
      stage: "ideation",
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
      stage: "ideation",
      tags: ["Social Impact", "Food Waste", "Logistics"],
      category: "social",
      detailedDescription:
        "A logistics platform that efficiently connects restaurants and grocery stores with food banks and charities to redistribute surplus food, reducing waste and fighting hunger.",
      targetMarket: "Restaurants, grocery stores, and food banks",
      businessModel: "B2B SaaS with impact measurement tools",
      techStack: ["React.js", "Node.js", "Google Maps API", "Twilio"],
    },
    // --- Brain History Ideas ---
    {
      id: 1001,
      title: "Local Loco – Real-Time Deals from Local Shops",
      miniPitch: "A hyperlocal promotion platform that boosts visibility for small businesses using real-time, social-media-style deal posts.",
      stage: "seed",
      tags: ["SMEs", "QR redemption", "community commerce", "neighborhood shops", "app-based promotions"],
      category: "startup",
      detailedDescription: "A hyperlocal promotion platform that boosts visibility for small businesses using real-time, social-media-style deal posts. Consumers benefit from discovering nearby discounts while supporting local merchants.",
      targetMarket: "Small businesses, local merchants, deal-seeking consumers",
      businessModel: "Commission on redemptions, premium merchant features",
      techStack: ["React Native", "Node.js", "Firebase"],
    },
    {
      id: 1002,
      title: "StartupLink – Verified Student Startup Platform",
      miniPitch: "A collaboration hub for polytechnic student founders to discover, verify, and connect with other legit startups.",
      stage: "seed",
      tags: ["Polytechnic founders", "startup verification", "MVP showcase", "team forming"],
      category: "startup",
      detailedDescription: "A collaboration hub where polytechnic student founders can discover, verify, and connect with other legit startups. Helps avoid time-wasting or scammy connections.",
      targetMarket: "Polytechnic student founders, early-stage startups",
      businessModel: "Freemium, verification fees, sponsorships",
      techStack: ["Next.js", "PostgreSQL", "Vercel"],
    },
    {
      id: 1003,
      title: "SubGuard – Smart Mobile Subscription Manager",
      miniPitch: "A privacy-first mobile app to detect, manage, and cancel hidden subscriptions.",
      stage: "ideation",
      tags: ["Subscription tracker", "financial health", "cancellation assistant", "data privacy"],
      category: "productivity",
      detailedDescription: "A privacy-first mobile app to detect, manage, and cancel hidden subscriptions. Targets subscription fatigue and dark UX traps.",
      targetMarket: "Mobile users, subscription-heavy consumers",
      businessModel: "Subscription, premium features",
      techStack: ["React Native", "Expo", "Stripe"],
    },
    {
      id: 1004,
      title: "GURU AI – AI-Powered Scriptwriter & Video Generator",
      miniPitch: "A tool designed to turn written prompts into ready-to-publish video content.",
      stage: "success",
      tags: ["Video automation", "AI scriptwriting", "CapCut integration", "content speed"],
      category: "ai",
      detailedDescription: "A tool designed to turn written prompts into ready-to-publish video content. Targets content creators, marketers, and students with fast, AI-driven production.",
      targetMarket: "Content creators, marketers, students",
      businessModel: "SaaS, pay-per-video, integrations",
      techStack: ["Python", "Hugging Face", "CapCut API"],
    },
    {
      id: 1005,
      title: "SilverConnect – A Senior-Friendly Digital Companion",
      miniPitch: "A senior-friendly digital assistant platform for essential services, digital skills, and safe communication.",
      stage: "ideation",
      tags: ["Senior-friendly technology", "digital literacy", "online safety", "scam alerts", "telehealth", "online banking", "communication tools", "guided tutorials"],
      category: "health",
      detailedDescription: "A senior-friendly digital assistant platform that helps elderly users access essential services like banking and telehealth, improve digital skills with guided tutorials, stay safe online with scam alerts and simple security, and stay connected with family through built-in communication tools.",
      targetMarket: "Elderly users, caregivers, families",
      businessModel: "Subscription, partnerships with service providers",
      techStack: ["React Native", "Twilio", "Node.js"],
    },
    {
      id: 1006,
      title: "StepFresh – Refresh Your Step, Sustainably",
      miniPitch: "A modular footwear system for easy sole replacement and sustainable urban living.",
      stage: "ideation",
      tags: ["Modular footwear", "sole replacement", "sustainable design", "urban mobility", "eco-conscious lifestyle", "user-friendly system", "reusable soles", "minimal waste"],
      category: "productivity",
      detailedDescription: "A modular footwear system that empowers users to extend the life of their shoes by easily swapping worn-out soles at home or in shared spaces. Designed for eco-conscious urban professionals, StepFresh combines sleek design, sustainable materials, and a smart attachment system for ultimate convenience. Whether you're switching from your office commute to the gym or just refreshing worn treads, StepFresh keeps your shoes—and your values—aligned.",
      targetMarket: "Urban professionals, eco-conscious consumers",
      businessModel: "Product sales, replacement parts, subscription for upgrades",
      techStack: ["Product design", "E-commerce", "Sustainable materials"],
    },
    {
      id: 1007,
      title: "SnapSweep – Declutter Photos by Face Detection",
      miniPitch: "A lightweight mobile utility to clean up faceless, random, or low-value images using on-device AI.",
      stage: "ideation",
      tags: ["Face detection", "photo cleaner", "privacy-first", "gallery declutter", "mobile utility"],
      category: "ai",
      detailedDescription: "A lightweight mobile utility that helps users clean up faceless, random, or low-value images from their photo gallery using on-device AI. With SnapSweep, you reclaim space, keep only what matters, and enjoy an organized camera roll — all without giving up privacy.",
      targetMarket: "Mobile users, privacy-conscious consumers",
      businessModel: "Freemium, in-app purchases",
      techStack: ["React Native", "TensorFlow Lite", "Mobile AI"],
    },
    {
      id: 1008,
      title: "ArtistryHub – Collaborative Platform for Artists",
      miniPitch: "A platform for artists to collaborate on digital and physical projects, share resources, and build creative teams.",
      stage: "ideation",
      tags: ["Art", "Collaboration", "Creatives", "Projects", "Community"],
      category: "marketplace",
      detailedDescription: "ArtistryHub connects artists from various disciplines, enabling them to find collaborators, manage joint projects, and showcase their work. Features include project boards, resource sharing, and a portfolio gallery for both digital and physical art.",
      targetMarket: "Artists, designers, creative teams, art students.",
      businessModel: "Freemium, commission on project listings, premium collaboration tools.",
      techStack: ["React", "Node.js", "MongoDB", "Cloud Storage"],
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
                This section is protected due to the presence of innovative startup ideas. Please enter the password provided by Mohamed Aslam to continue.
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
               Please solve the captcha to unlock access and prevent AI intrusion.
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
            building or just fixing a problem I encounter in my daily life. Each idea represents a potential solution 
            to real-world problems.
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
                        <h4 className="text-sm font-semibold text-cyan-400 mb-1">Just the Recommended Tech Stack:</h4>
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

        {/* Stage Descriptions */}
        <div className="max-w-3xl mx-auto mt-8">
          <Card className="bg-slate-800/70 border-cyan-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 text-center">What do the stages mean?</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li><span className="font-bold text-blue-400">Ideation:</span> Early idea stage, not yet started or just brainstorming.</li>
                <li><span className="font-bold text-purple-400">Concept:</span> Actively working on the idea, researching, or prototyping.</li>
                <li><span className="font-bold text-yellow-400">Seed:</span> MVP or initial version built, some real-world validation or traction.</li>
                <li><span className="font-bold text-green-400">Success:</span> Completed, launched, or achieved significant milestones.</li>
                <li><span className="font-bold text-gray-400">Paused:</span> Temporarily on hold, not actively working on it.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
