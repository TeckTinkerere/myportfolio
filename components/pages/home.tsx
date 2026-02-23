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
              {/* Right Side - Technical Summary */}
              <div className="order-1 lg:order-2 text-center lg:text-left pt-16 sm:pt-20">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                      Mohamed Aslam
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Abdul Gafoor
                      </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-300 font-light">Full-Stack Developer</p>
                  </div>
                  <p className="text-lg text-gray-400 max-w-2xl">
                    Full-stack developer with experience building web systems using modern JavaScript frameworks and cloud-backed architectures. Focus on component-driven development, testing practices, and iterative improvement processes.
                  </p>
                  
                  {/* Technical Skills Snapshot */}
                  <div className="bg-slate-800/30 rounded-lg p-6 max-w-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Technical Focus Areas</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Frontend</h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>React.js, Next.js</li>
                          <li>TypeScript, JavaScript</li>
                          <li>Tailwind CSS</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Backend</h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>Node.js, Express.js</li>
                          <li>FastAPI, Java</li>
                          <li>PostgreSQL, Firebase</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Cloud & DevOps</h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>Vercel, Netlify</li>
                          <li>Google Cloud Platform</li>
                          <li>Git, GitHub Actions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Systems Built</h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>6 deployed applications</li>
                          <li>4 personal projects</li>
                          <li>2 academic projects</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link href="#projects" passHref legacyBehavior>
                      <button
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                      >
                        View Technical Projects
                        <ArrowDown className="ml-2 h-5 w-5" />
                      </button>
                    </Link>
                    <Link href="/contact" passHref legacyBehavior>
                      <button
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 border"
                      >
                        Contact
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
                Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Experience</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Full-Stack Developer | Web Systems | Cloud-Backed Applications | IT Student @SP
              </p>
            </div>

            {/* Technical Summary */}
            <div className="mb-16">
              <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">System Building Experience</h2>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        Full-stack developer with 1+ years of experience building web systems using modern JavaScript frameworks and cloud-backed architectures. Specializes in component-driven development, testing practices, and iterative improvement processes.
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        Technical expertise includes React.js/Next.js frontend development, Node.js/FastAPI backend systems, PostgreSQL database design, and cloud deployment on Vercel and Google Cloud Platform. Experience with both personal projects and academic coursework in system design and security analysis.
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        Built 6 deployed applications including hyperlocal business platforms, student collaboration systems, and mindfulness applications. Focus on scalable architecture, testing strategies, and production deployment considerations.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h4 className="text-cyan-400 font-semibold mb-2">Systems Built</h4>
                          <p className="text-2xl font-bold text-white">6</p>
                          <p className="text-sm text-gray-400">Deployed Applications</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h4 className="text-cyan-400 font-semibold mb-2">Technologies</h4>
                          <p className="text-2xl font-bold text-white">20+</p>
                          <p className="text-sm text-gray-400">Frameworks & Tools</p>
                        </div>
                      </div>
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

            {/* Technical Experience Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Technical Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">LocalLoco</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Full-Stack Developer</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Sep 2024 - Present</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Architected hyperlocal business platform using Next.js, FastAPI, and PostgreSQL. Implemented real-time deal aggregation, QR-based redemption tracking, and volunteer moderation system.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">StartupLink</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Full-Stack Developer</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Apr 2025 - Present</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Built student-startup collaboration platform with Firebase authentication, email domain verification, and role-based access control. Implemented real-time messaging and job application tracking.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Academic Projects</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Developer & Security Analyst</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">2023 - 2024</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Developed Java library management system with OOP principles. Conducted OWASP Top 10 security vulnerability assessment with remediation recommendations.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Personal Projects</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Frontend Developer</p>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">2023 - Present</Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">Built mindfulness web application with local storage, freelance resource hub with static site optimization, and various React-based applications with responsive design.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Technical Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold">FE</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Frontend</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Advanced</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>React.js, Next.js</li>
                      <li>TypeScript, JavaScript</li>
                      <li>Tailwind CSS, HTML5</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold">BE</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Backend</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Experienced</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>Node.js, Express.js</li>
                      <li>FastAPI, Java</li>
                      <li>REST APIs</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold">DB</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Database</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Experienced</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>PostgreSQL, SQL</li>
                      <li>Firebase Firestore</li>
                      <li>Supabase</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold">CD</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Cloud & DevOps</h3>
                    <p className="text-cyan-400 font-semibold mb-2">Proficient</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>Vercel, Netlify</li>
                      <li>Google Cloud Platform</li>
                      <li>Git, GitHub Actions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Development Timeline */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Development Timeline</h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
                <div className="space-y-12">
                  <div className="flex items-center flex-row">
                    <div className="w-1/2 pr-8 text-right">
                      <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mb-3">
                            2023
                          </Badge>
                          <h3 className="text-xl font-bold text-white mb-2">Foundation Development</h3>
                          <p className="text-gray-300 leading-relaxed">Started IT diploma program, learned Java OOP principles, built first console applications, and developed understanding of system design fundamentals.</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full border-4 border-slate-900" />
                    <div className="w-1/2" />
                  </div>
                  <div className="flex items-center flex-row-reverse">
                    <div className="w-1/2 pl-8 text-left">
                      <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mb-3">
                            2024
                          </Badge>
                          <h3 className="text-xl font-bold text-white mb-2">Web Systems Development</h3>
                          <p className="text-gray-300 leading-relaxed">Advanced to full-stack web development with React.js and Node.js, built production applications, implemented cloud deployment, and conducted security analysis projects.</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full border-4 border-slate-900" />
                    <div className="w-1/2" />
                  </div>
                  <div className="flex items-center flex-row">
                    <div className="w-1/2 pr-8 text-right">
                      <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mb-3">
                            2025
                          </Badge>
                          <h3 className="text-xl font-bold text-white mb-2">Production Systems</h3>
                          <p className="text-gray-300 leading-relaxed">Building scalable web applications with modern frameworks, implementing testing strategies, and focusing on system architecture and production deployment considerations.</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full border-4 border-slate-900" />
                    <div className="w-1/2" />
                  </div>
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
