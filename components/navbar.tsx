"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Mail, Sparkles } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface NavbarProps {
  onNewsletterClick: () => void
}

export default function Navbar({ onNewsletterClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects", badge: "Featured" },
    { name: "Portfolio", path: "/all-projects" },
    { name: "Certifications", path: "/hall-of-fame" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-cyan-500/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-base">MA</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-lg tracking-tight">Mohamed Aslam</span>
                <div className="text-xs text-cyan-400 font-medium">Full-Stack Developer</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                    pathname === item.path 
                      ? "text-cyan-400" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.name}
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded text-cyan-400 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20" />
                  )}
                  <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Newsletter Button - Desktop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewsletterClick}
                className="hidden lg:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-500/20 transition-all"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Newsletter</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-10 h-10 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-500/20 transition-all rounded-lg"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-10 h-10 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-500/20 transition-all rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-20 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-900/98 backdrop-blur-xl border-l border-white/10 z-40 lg:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Mohamed Aslam</div>
                <div className="text-xs text-cyan-400">Full-Stack Developer</div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-xl group ${
                    pathname === item.path
                      ? "text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {item.name}
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-cyan-400 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {pathname === item.path && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Newsletter Button */}
            <div className="mt-6 px-2">
              <Button
                variant="outline"
                onClick={() => {
                  onNewsletterClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 py-6 rounded-xl"
              >
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Subscribe to Newsletter</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>© 2026 Mohamed Aslam</span>
              <div className="flex items-center gap-1 text-cyan-400">
                <Sparkles className="h-3 w-3" />
                <span>Portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
