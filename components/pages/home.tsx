"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />

        {/* Floating Particles */}
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

        {/* Mouse Follower Effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="text-xl sm:text-2xl text-gray-300 font-light">Full-Stack Developer & Visionary Leader</p>
              </div>

              <p className="text-lg text-gray-400 max-w-2xl">
                Transforming ideas into digital reality through innovative web development, strategic leadership, and
                creative problem-solving. From struggling in secondary school to excelling in IT - this is my journey of
                growth and innovation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/about" passHref legacyBehavior>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <a>
                      Explore My Journey
                      <ArrowDown className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </Link>
                <Link href="/projects" passHref legacyBehavior>
                  <Button
                    asChild
                    variant="outline"
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
                  >
                    <a>
                      View Projects
                    </a>
                  </Button>
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-cyan-400" />
      </div>
    </div>
  )
}
