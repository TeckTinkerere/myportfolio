"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react"

interface FooterProps {
  onNewsletterClick: () => void
}

export default function Footer({ onNewsletterClick }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/in/mohamed-aslam-abdul",
      color: "hover:text-blue-400",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/mohamedaslam",
      color: "hover:text-gray-300",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com/mohamedaslam",
      color: "hover:text-pink-400",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: "mailto:contact@mohamedaslam.dev",
      color: "hover:text-cyan-400",
    },
  ]

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Visionary Wall", path: "/visionary-wall" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <footer className="relative bg-slate-900/50 border-t border-cyan-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">MA</span>
              </div>
              <span className="text-white font-semibold text-xl">Mohamed Aslam</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Full-Stack Developer with experience building web systems using modern JavaScript frameworks and cloud-backed architectures. Focus on component-driven development and production deployment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${link.color} transition-colors duration-300`}
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-300 text-sm">Get notified about my latest projects and insights.</p>
            <Button
              onClick={onNewsletterClick}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
            >
              Join Newsletter
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-cyan-500/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Mohamed Aslam Abdul Gafoor. All rights reserved.</p>
          <Button
            onClick={scrollToTop}
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 mt-4 sm:mt-0"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  )
}
