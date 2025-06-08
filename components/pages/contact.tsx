"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)
    setFormData({ name: "", email: "", subject: "", message: "" })

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to collaborate on your next project? Have a question about my work? I'd love to hear from you. Let's
            create something amazing together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="relative">
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send Me a Message</h2>
                {/* Maintenance Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-2">Contact Form in Maintenance</h3>
                    <p className="text-gray-200 mb-4">This form is temporarily unavailable.<br />Please email me directly at <a href="mailto:aslam040607@gmail.com" className="underline text-cyan-300">aslam040607@gmail.com</a> or connect via <a href="https://www.linkedin.com/in/mohamed-aslam-abdul" target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">LinkedIn</a>.</p>
                  </div>
                </div>
                {/* Disabled Form (visually present but not usable) */}
                <form className="space-y-6 pointer-events-none opacity-50 select-none">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      disabled
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-gray-400"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      disabled
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-gray-400"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      disabled
                      className="bg-slate-700/50 border-cyan-500/30 text-white placeholder-gray-400 min-h-32"
                      placeholder="Tell me about your project or question..."
                    />
                  </div>
                  <Button
                    type="button"
                    disabled
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 text-lg font-semibold rounded-lg opacity-60"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <p className="text-gray-300">aslam040607@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Phone</h3>
                      <p className="text-gray-300">+65 9343 0467</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Location</h3>
                      <p className="text-gray-300">Singapore</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Preview */}
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Connect on LinkedIn</h2>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Mohamed Aslam LinkedIn"
                    className="w-16 h-16 rounded-full border-2 border-cyan-500/30"
                  />
                  <div>
                    <h3 className="text-white font-semibold">Mohamed Aslam Abdul Gafoor</h3>
                    <p className="text-cyan-400">Full-Stack Developer & Visionary Leader</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Connect with me on LinkedIn to stay updated on my latest projects, achievements, and professional
                  journey.
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open("https://www.linkedin.com/in/mohamed-aslam-abdul", "_blank")}
                >
                  View LinkedIn Profile
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">Response Time</h3>
                <p className="text-gray-300 text-sm">
                  I typically respond to messages within 24-48 hours. For urgent matters, please mention it in your
                  subject line.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-slate-800 border-green-500/30 max-w-md mx-4">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for reaching out! I'll get back to you within 24-48 hours.
                </p>
                <Button
                  onClick={() => setShowSuccess(false)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
