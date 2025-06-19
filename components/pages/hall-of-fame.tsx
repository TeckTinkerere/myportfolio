"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function HallOfFame() {
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [modalAlt, setModalAlt] = useState<string>("")

  const topCertificates = [
    {
      id: 1,
      title: "YAC Season 6",
      issuer: "National Youth Council",
      date: "2025-03-15",
      description: "1st Place - Youth Action Challenge Season 6. Recognized for impactful tech-driven solutions for youth and community.",
      image: "/YACS.png",
      likes: 60,
      category: "Entrepreneurship",
      tags: ["Entrepreneurship", "Leadership", "Participation", "Startup", "Business"],
    },
    {
      id: 2,
      title: "Batey Hackathon SP-2024",
      issuer: "Singapore Polytechnic",
      date: "2024-09-10",
      description: "2nd Place - SP Batey Hackathon 2024. Awarded for innovative full-stack web development and teamwork.",
      image: "/Batey.png",
      likes: 52,
      category: "Hackathon",
      tags: ["Software Development", "Participation", "Leadership", "Startup", "Entrepreneurship"],
    },
    {
      id: 3,
      title: "AI FOR GOOD (YOUTH) STUDENT FACILITATOR",
      issuer: "AI Singapore",
      date: "2025-4-15",
      description: "3rd Place - AI for Good (Youth) Student Facilitator. Recognized for leadership and facilitation in AI-driven social impact projects.",
      image: "/AITrainer.png",
      likes: 45,
      category: "AI & Leadership",
      tags: ["AI", "Leadership", "Participation"],
    },
  ]

  const allCertificates = [
    ...topCertificates,
    {
      id: 4,
      title: "Rock Your LinkedIn Profile",
      issuer: "LinkedIn",
      date: "2025-05-01",
      description: "Completed LinkedIn's official profile optimization course.",
      image: "/rockurprofile.png",
      likes: 29,
      category: "Professional Development",
      tags: ["LinkedIn", "General"],
    },
    {
      id: 5,
      title: "Leadership Foundations: Leadership Styles and Models",
      issuer: "LinkedIn Learning",
      date: "2025-05-03",
      description: "Completed training on leadership styles and models.",
      image: "/leadership1.png",
      likes: 33,
      category: "Leadership",
      tags: ["Leadership", "LinkedIn", "General"],
    },
    {
      id: 6,
      title: "Kotlin Essential Training: Object-Oriented and Async Code",
      issuer: "LinkedIn Learning",
      date: "2025-05-15",
      description: "Essential training in Kotlin, focusing on object-oriented and asynchronous programming.",
      image: "/kotlinessential.png",
      likes: 0,
      category: "Programming",
      tags: ["Software Development", "General"],
    },
    {
      id: 7,
      title: "AI FOR GOOD (YOUTH) TRAIN-THE-TRAINER PROGRAMME",
      issuer: "AI Singapore",
      date: "2025-4-18",
      description: "Completed the AI for Good (Youth) Train-the-Trainer Programme, focusing on AI education and facilitation for youth.",
      image: "/AIBootcamp.png",
      likes: 0,
      category: "Programming",
      tags: ["Software Development", "General", "AI", "Participation"],
    },
    {
      id: 8,
      title: "Developing Credibility as a Leader",
      issuer: "LinkedIn Learning",
      date: "2025-06-01",
      description: "Completed the course on developing credibility as a leader. Helped me imrpove my leadership skills and understand some previously obsure reasons.",
      image: "/developleader.png",
      likes: 0,
      category: "Leadership",
      tags: ["LinkedIn", "General", "Leadership"],
    },
    {
      id: 9,
      title: "How Leaders Can Motivate Others by Creating Meaning",
      issuer: "LinkedIn Learning",
      date: "2025-05-26",
      description: "Learned how to motivate others as a Leader, ensuring the team quality is consistent mentally and in  their work.",
      image: "/motivateothers.png",
      likes: 0,
      category: "Leadership",
      tags: ["LinkedIn", "General", "Leadership"],
    },
  ]

  useEffect(() => {
    if (!modalImage) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalImage]);

  // Collect all unique tags
  const allTags = [
    "All",
    ...Array.from(
      new Set(
        allCertificates.flatMap(cert => cert.tags || ["General"])
      )
    ),
  ]

  const [activeTag, setActiveTag] = useState<string>("All")

  const filteredCertificates =
    activeTag === "All"
      ? allCertificates
      : allCertificates.filter(cert => (cert.tags || ["General"]).includes(activeTag))

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Hall of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Fame</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A collection of certifications and achievements that mark my journey of continuous learning and professional
            development in technology and leadership.
          </p>
        </div>

        {/* Top 3 Certificates - Pedestal Style */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">🏆 Top Achievements</h2>

          {/* Futuristic Background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* Second Place */}
              <div className="order-1 md:order-1">
                <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-xl">2</span>
                      </div>
                      <Badge variant="outline" className="border-gray-500/50 text-gray-400">
                        Silver
                      </Badge>
                    </div>
                    <img
                      src={topCertificates[1].image || "/placeholder.svg"}
                      alt={topCertificates[1].title}
                      className="w-full max-h-52 object-contain rounded-lg mb-4 cursor-pointer bg-slate-900 transition-transform duration-300 hover:scale-105"
                      style={{ aspectRatio: '4/3', background: '#0f172a' }}
                      onClick={() => { setModalImage(topCertificates[1].image); setModalAlt(topCertificates[1].title); }}
                    />
                    <h3 className="text-lg font-bold text-white mb-2">{topCertificates[1].title}</h3>
                    <p className="text-cyan-400 font-semibold mb-2">{topCertificates[1].issuer}</p>
                    <p className="text-gray-300 text-sm mb-4">{topCertificates[1].description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(topCertificates[1].date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* First Place */}
              <div className="order-2 md:order-2 transform md:scale-110">
                <Card className="bg-slate-800/70 border-yellow-500/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                        Gold
                      </Badge>
                    </div>
                    <img
                      src={topCertificates[0].image || "/placeholder.svg"}
                      alt={topCertificates[0].title}
                      className="w-full max-h-52 object-contain rounded-lg mb-4 cursor-pointer bg-slate-900 transition-transform duration-300 hover:scale-105"
                      style={{ aspectRatio: '4/3', background: '#0f172a' }}
                      onClick={() => { setModalImage(topCertificates[0].image); setModalAlt(topCertificates[0].title); }}
                    />
                    <h3 className="text-xl font-bold text-white mb-2">{topCertificates[0].title}</h3>
                    <p className="text-cyan-400 font-semibold mb-2">{topCertificates[0].issuer}</p>
                    <p className="text-gray-300 text-sm mb-4">{topCertificates[0].description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(topCertificates[0].date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Third Place */}
              <div className="order-3 md:order-3">
                <Card className="bg-slate-800/70 border-orange-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-xl">3</span>
                      </div>
                      <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                        Bronze
                      </Badge>
                    </div>
                    <img
                      src={topCertificates[2].image || "/placeholder.svg"}
                      alt={topCertificates[2].title}
                      className="w-full max-h-52 object-contain rounded-lg mb-4 cursor-pointer bg-slate-900 transition-transform duration-300 hover:scale-105"
                      style={{ aspectRatio: '4/3', background: '#0f172a' }}
                      onClick={() => { setModalImage(topCertificates[2].image); setModalAlt(topCertificates[2].title); }}
                    />
                    <h3 className="text-lg font-bold text-white mb-2">{topCertificates[2].title}</h3>
                    <p className="text-cyan-400 font-semibold mb-2">{topCertificates[2].issuer}</p>
                    <p className="text-gray-300 text-sm mb-4">{topCertificates[2].description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(topCertificates[2].date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 border text-sm
                ${activeTag === tag ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-cyan-500" : "bg-slate-800/50 text-gray-300 border-cyan-500/20 hover:bg-cyan-500/10"}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* All Certificates - Instagram Style Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12">All Certifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <Card
                key={certificate.id}
                className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={certificate.image || "/placeholder.svg"}
                    alt={certificate.title}
                    className="w-full max-h-56 object-contain transition-transform duration-300 group-hover:scale-110 rounded-lg cursor-pointer bg-slate-900"
                    style={{ aspectRatio: '4/3', background: '#0f172a' }}
                    onClick={() => { setModalImage(certificate.image); setModalAlt(certificate.title); }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                      {certificate.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {certificate.title}
                  </h3>
                  <p className="text-cyan-400 font-semibold text-sm mb-2">{certificate.issuer}</p>
                  <p className="text-gray-300 text-xs leading-relaxed mb-3">{certificate.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(certificate.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 flex justify-center">
          <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-cyan-500/20 backdrop-blur-sm max-w-3xl w-full">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Achievement Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{allCertificates.length}</div>
                  <div className="text-gray-300">Total Certificates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">7</div>
                  <div className="text-gray-300">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">2025</div>
                  <div className="text-gray-300">Most Active Year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded">
          <a
            href="https://github.com/TeckTinkerere/myportfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source on GitHub
          </a>
        </Button>
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setModalImage(null)}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white hover:text-cyan-400 text-2xl transition-colors"
              onClick={() => setModalImage(null)}
              aria-label="Close large certificate view"
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt={modalAlt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg bg-slate-900/80"
              style={{ background: '#0f172a' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
