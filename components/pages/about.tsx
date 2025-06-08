"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, MapPin, Users, Award } from "lucide-react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export default function About() {
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
      title: "Organizing Committee Member",
      organization: "LEAP 2026 (SOC-CLS)",
      period: "2025 - Present",
      description: "Contributing to the organization of Singapore's premier technology and innovation summit.",
      icon: <Award className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
    },
  ]

  const journey = [
    {
      year: "2020-2022",
      title: "Secondary School Challenges",
      description: "Faced academic difficulties but discovered passion for technology and problem-solving.",
    },
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

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Me</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Co-Founder & CEO of Local Loco | Web & AI Enthusiast | Aspiring Software Dev | IT Student @SP | Founder @ StartupLink
          </p>
        </div>

        {/* Personal Summary */}
        <div className="mb-16">
          <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    I'm a builder at heart—whether it's code, teams, or ideas. My journey started with academic struggles, but I found my spark in technology and entrepreneurship. Now, I co-lead LocalLoco, where I turn real-world problems into digital solutions, and I thrive on learning by doing.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    My edge? I blend hands-on web development (React, Node.js), rapid prototyping, and a knack for rallying people around a vision. I love experimenting, failing fast, and iterating—whether it's for a hackathon, a startup, or a community project.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Beyond code, I'm passionate about storytelling through video, and I believe the best teams are built on trust, curiosity, and a shared sense of purpose. I'm happiest when I'm building something that matters—with people who care.
                  </p>
                  <p className="text-cyan-400 italic">I don't just want to predict the future—I want to help invent it, one project at a time.</p>
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

        {/* Experience Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">LocalLoco</h3>
                <p className="text-cyan-400 font-semibold mb-2">Chief Executive Officer</p>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Sep 2024 - Present</Badge>
                <p className="text-gray-300 text-sm leading-relaxed">Leading LocalLoco's vision, strategy, and growth—empowering small businesses, driving innovation, and ensuring our platform creates real community impact.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">PolyStart Connect (StartupLink)</h3>
                <p className="text-cyan-400 font-semibold mb-2">Founder</p>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Apr 2025 - Present</Badge>
                <p className="text-gray-300 text-sm leading-relaxed">Founder of PolyStart Connect – a student-driven side project exploring how verified, closed-network startup collaboration can empower young founders to connect, co-create, and grow.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Freelance</h3>
                <p className="text-cyan-400 font-semibold mb-2">Video Editor</p>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Sep 2024 - Present</Badge>
                <p className="text-gray-300 text-sm leading-relaxed">Montages for classes, exchange visit farewell video, and leadership camp recap video.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Adecco</h3>
                <p className="text-cyan-400 font-semibold mb-2">Event Assistant</p>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">Apr 2025 - May 2025</Badge>
                <p className="text-gray-300 text-sm leading-relaxed">Helped set up polling stations, managed overnight watch, and was wheelchair manager for General Elections 2025.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Roles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Current Leadership Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                  <p className="text-cyan-400 font-semibold mb-2">{role.organization}</p>
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-3">
                    {role.period}
                  </Badge>
                  <p className="text-gray-300 text-sm leading-relaxed">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12">My Journey</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />

            <div className="space-y-12">
              {journey.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mb-3">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full border-4 border-slate-900" />

                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Activity Calendar</h2>
          <ActivityCalendar />
        </div>
      </div>
    </div>
  )
}

// ActivityCalendar component
function ActivityCalendar() {
  // Example activity data
  const activities = [
    { date: new Date(2024, 5, 10), title: "LocalLoco Sprint Planning", description: "Led a sprint planning session for the LocalLoco MVP." },
    { date: new Date(2024, 5, 12), title: "StartupLink Demo", description: "Presented StartupLink to potential collaborators." },
    { date: new Date(2024, 5, 15), title: "Hackathon", description: "Participated in NUS GURU AI Hackathon." },
    { date: new Date(2024, 5, 18), title: "Video Project", description: "Completed a freelance video montage for a class event." },
    { date: new Date(2024, 5, 22), title: "SPCyclists Event", description: "Coordinated logistics for a cycling event." },
    { date: new Date(2024, 5, 25), title: "Freelance Academy Meetup", description: "Organized a networking session for Freelance Academy." },
  ]

  const [selected, setSelected] = useState<Date | undefined>(undefined)

  // Find activities for the selected date
  const selectedActivities = selected
    ? activities.filter(a => a.date.toDateString() === selected.toDateString())
    : []

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
      <div className="bg-slate-800/50 border-cyan-500/20 rounded-lg p-6 shadow-lg">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={date => setSelected(date)}
          className="rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-[250px]">
        <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">{selected ? selected.toLocaleDateString() : "Select a date"}</h3>
            {selectedActivities.length > 0 ? (
              <ul className="space-y-4">
                {selectedActivities.map((activity, idx) => (
                  <li key={idx}>
                    <p className="text-cyan-400 font-semibold">{activity.title}</p>
                    <p className="text-gray-300 text-sm">{activity.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">{selected ? "No activities for this day." : "Pick a date to see activities."}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
