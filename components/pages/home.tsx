"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Award } from "lucide-react"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const roles = [
    {
      title: "ExCo (Events)",
      organization: "Freelance Academy",
      period: "2024 - Present",
      description: "Leading event coordination and strategic planning for freelance community initiatives as a Student Interest Body through MAD (Media, Arts and Design).",
      icon: <Users className="h-5 w-5" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Assistant Quartermaster",
      organization: "Main Committee of SPCyclists",
      period: "2025 - Present",
      description: "Managing resources and logistics for cycling community events and activities.",
      icon: <MapPin className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Organizing Committee Member (Publicity)",
      organization: "LEAP 2026 (SOC-CLS)",
      period: "2025 - Present",
      description: "Contributing to the organization of Singapore's premier technology and innovation summit.",
      icon: <Award className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
    },
  ]

  const journey = [
    {
      year: "2023",
      title: "IT Diploma Journey Begins",
      description: "Enrolled in Diploma in Information Technology, marking the beginning of my transformation.",
    },
    {
      year: "2024",
      title: "Academic Excellence",
      description: "Achieving A's modules and excelling in web development, video editing, and leadership roles.",
    },
    {
      year: "2025",
      title: "Future Vision",
      description: "Building innovative solutions and leading teams towards technological advancement while being happy with what I have everyday.",
    },
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />
        {/* Floating Particles */}
        {isClient && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}
        {/* Mouse Follower Effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Hero Image */}
              <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                  <img
                    src="/mainpage.jpg"
                    alt="Mohamed Aslam Abdul Gafoor"
                    className="relative z-10 w-80 h-96 object-cover rounded-2xl border-2 border-cyan-500/30 shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">MA</span>
                  </div>
                </div>
              </div>
              {/* Right Side - Hero Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left pt-16 sm:pt-20">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                      Mohamed Aslam
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Abdul Gafoor
                      </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-300 font-light">Full-Stack Developer & Crazy Entrepreneur</p>
                  </div>
                  <p className="text-lg text-gray-400 max-w-2xl">
                    Transforming ideas into digital reality through innovative web development, strategic leadership, and
                    creative problem-solving. From struggling in secondary school to excelling in IT - this is my journey of
                    growth and innovation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link href="#about" passHref legacyBehavior>
                      <button
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                      >
                        Explore My Journey
                        <ArrowDown className="ml-2 h-5 w-5" />
                      </button>
                    </Link>
                    <Link href="#projects" passHref legacyBehavior>
                      <button
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 border"
                      >
                        View My Projects
                      </button>
                    </Link>
                  </div>
                  <div className="flex gap-6 justify-center lg:justify-start pt-4">
                    <a
                      href="https://www.linkedin.com/in/mohamed-aslam-abdul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href="https://github.com/TeckTinkerere"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                    <a
                      href="mailto:aslam040607@gmail.com"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <Mail className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Page Divider */}
        <div className="relative z-10 w-full flex items-center justify-center gap-4 py-8">
          <div className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <div className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>

        {/* ABOUT ME SECTION */}
        <section id="about" className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Me</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Co-Founder & CEO of Local Loco | Web & AI Enthusiast | Aspiring Software Dev | IT Student @SP | Founder @ StartupLink
              </p>
            </div>

            {/* Personal Summary */}
            <div className="mb-16">
              <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        I'm a builder at heart—whether it's code, teams, or ideas. My journey started with academic struggles, but I found my spark in technology and entrepreneurship. Now, I co-lead LocalLoco, where I turn real-world problems into digital solutions, and I thrive on learning by doing.
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        My edge? I blend hands-on web development (React, Node.js), rapid prototyping, and a knack for rallying people around a vision. I love experimenting, failing fast, and iterating—whether it's for a hackathon, a startup, or a community project.
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        Beyond code, I'm passionate about storytelling through video, and I believe the best teams are built on trust, curiosity, and a shared sense of purpose. I'm happiest when I'm building something that matters—with people who care.
                      </p>
                      <p className="text-cyan-400 italic">I don't just want to predict the future—I want to help invent it, one project at a time.</p>
                    </div>
                    <div className="relative">
                      <img
                        src="/event%231.jpg"
                        alt="Mohamed Aslam at work"
                        className="w-full h-80 object-cover rounded-lg border border-cyan-500/30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Experience Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">LocalLoco</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Chief Executive Officer</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Sep 2024 - Present</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Leading LocalLoco's vision, strategy, and growth—empowering small businesses, driving innovation, and ensuring our platform creates real community impact.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">PolyStart Connect (StartupLink)</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Founder</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Apr 2025 - Present</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Founder of PolyStart Connect – a student-driven side project exploring how verified, closed-network startup collaboration can empower young founders to connect, co-create, and grow.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Freelance</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Video Editor</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Sep 2024 - Present</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Montages for classes, exchange visit farewell video, and leadership camp recap video.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Adecco</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Event Assistant</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Apr 2025 - May 2025</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Helped set up polling stations, managed overnight watch, and was wheelchair manager for General Elections 2025.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Current Roles */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Current Leadership Roles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roles.map((role, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {role.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                      <p className="text-cyan-400 font-semibold mb-2">{role.organization}</p>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">
                        {role.period}
                      </Badge>
                      <p className="text-gray-300 text-sm leading-relaxed">{role.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">My Journey</h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
                <div className="space-y-12">
                  {journey.map((item, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                        <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mb-3">
                              {item.year}
                            </Badge>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{item.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                      {/* Timeline Dot */}
                      <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full border-4 border-slate-900" />
                      <div className="w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Next Button */}
            <div className="flex justify-center mt-12">
              <Link href="/skills">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full text-base font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                  Next: Skills <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 pointer-events-none">
        <ArrowDown className="h-6 w-6 text-cyan-400" />
      </div>
    </div>
  )
}
