"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Zap } from "lucide-react"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-cyan-500/30 max-w-md w-full relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

        <CardContent className="relative p-8">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Zap className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">Newsletter Maintenance</h2>

            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <p className="text-cyan-400 font-semibold mb-2">⛔ System Status</p>
              <p className="text-gray-300 leading-relaxed">
                Our newsletter is currently undergoing quantum calibration and futuristic enhancements. We're
                implementing next-generation features to deliver an even better experience.
              </p>
            </div>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Upgrading content delivery system</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Implementing AI-powered personalization</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Enhancing security protocols</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Stay tuned for updates! In the meantime, connect with me on LinkedIn or follow my GitHub for the latest
              project updates.
            </p>

            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
            >
              Got it, thanks!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
