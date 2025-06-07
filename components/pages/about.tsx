"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Award } from "lucide-react"

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
            Co-Founder & CEO of Local Loco | Web & AI Enthusiast | Aspiring Software Dev | IT Student @SP | Founder @ PolyStart Connect
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
                    As a full-stack developer currently pursuing a Diploma in Information Technology at Singapore Polytechnic and the Co-Founder of LocalLoco, a student-led startup focusing on building digital solutions for SMEs and social enterprises, I am passionate about creating user-centric technology to tackle real-world challenges, particularly in digital inclusion and small business enablement.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    My unique blend of technical skills and startup leadership sets me apart. At Local Loco, I oversee MVP development, coordinate agile student teams, and iterate based on user feedback. This hands-on experience has honed my ability to balance innovation with practicality and deliver effective solutions within tight deadlines. My strengths have been further refined through participation in national competitions like the Youth Action Challenge Season 6, NUS GURU AI competition, and as a finalist in the SP Batey Hackathon 2024.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    On the technical front, I excel in frontend development (HTML, CSS, JavaScript, React), backend (Node.js, Express, basic Python), and relational databases (SQL). I have experience with RESTful APIs, AI prototyping (Hugging Face API on Google Cloud), and tools like Git, Figma, CapCut, and Canva. My soft skills include effective communication, user-centered design thinking, adaptability, and teamwork, cultivated through project work and active engagement in CCAs such as Freelance Academy, SPCyclists, and SP Deejays.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Currently seeking a software engineering internship to deepen my backend development expertise, engage with real systems, and contribute to impactful projects. Outside of software development, I take on freelance projects in web and video editing, blending creativity and technology to deliver impactful results.
                  </p>
                  <p className="text-cyan-400 italic">“The best way to predict the future is to invent it.” – Alan Kay</p>
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
                <h3 className="text-xl font-bold text-white mb-2">PolyStart Connect</h3>
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
      </div>
    </div>
  )
}
