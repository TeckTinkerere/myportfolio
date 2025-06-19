"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import NewsletterModal from "@/components/newsletter-modal"
import Skills from "@/components/pages/skills"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function SkillsPage() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <Navbar onNewsletterClick={() => setShowNewsletter(true)} />
      <main className="relative">
        <Skills />
        <div className="flex justify-center mt-12 mb-12">
          <Link href="/projects">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full text-base font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
              Next: Projects <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </main>
      <Footer onNewsletterClick={() => setShowNewsletter(true)} />
      <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </div>
  )
} 