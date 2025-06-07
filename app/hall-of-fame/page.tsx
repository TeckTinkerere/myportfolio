"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import NewsletterModal from "@/components/newsletter-modal"
import HallOfFame from "@/components/pages/hall-of-fame"
import { useState } from "react"

export default function HallOfFamePage() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <Navbar onNewsletterClick={() => setShowNewsletter(true)} />
      <main className="relative">
        <HallOfFame />
      </main>
      <Footer onNewsletterClick={() => setShowNewsletter(true)} />
      <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </div>
  )
} 