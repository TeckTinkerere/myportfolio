"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
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
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
    { name: "Featured Projects", path: "/projects" },
    { name: "All Projects", path: "/all-projects" },
    { name: "Certifications", path: "/hall-of-fame" },
    { name: "Testimonials", path: "/visionary-wall" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MA</span>
            </div>
            <span className="text-white font-semibold text-lg">Mohamed Aslam</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative px-4 py-2 text-base font-medium transition-colors duration-200 ${
                  pathname === item.path ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
                }`}
              >
                {item.name}
                {pathname === item.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Newsletter */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewsletterClick}
              className="hidden sm:flex text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              Newsletter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 w-12 h-12 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-cyan-500/20">
            <div className="px-4 py-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg ${
                    pathname === item.path
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  onNewsletterClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-start px-4 py-3 mt-2 text-base font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg"
              >
                Newsletter
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
