export type ProjectStatus = 'Active' | 'Paused' | 'MVP' | 'Idea' | 'Completed';
export type ProjectCategory = 'Web App' | 'Mobile App' | 'Community' | 'Hackathon' | 'School' | 'Concept' | 'Product' | 'Chrome Extension' | 'Game' | 'CCA' | 'Telegram Bot';

export type BrainProject = {
  id: number;
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  keyTech: string;
  description: string;
  demoUrl?: string;
  githubUrl?: string;
  notes?: string;
};

export const allProjects: BrainProject[] = [
  // Active Projects
  {
    id: 1,
    name: "LocalLoco",
    status: "Active",
    category: "Web App",
    keyTech: "Next.js, Tailwind, Supabase, QR-based redemption",
    description: "Hyperlocal business discovery platform connecting residents with neighborhood deals through community-driven content moderation",
    demoUrl: "https://v0-local-loco-website.vercel.app/",
    githubUrl: "https://github.com/mohamedaslam/local-loco",
    notes: "Production startup application"
  },
  {
    id: 2,
    name: "StartupLink",
    status: "Active",
    category: "Web App",
    keyTech: "Next.js 14, Firebase Auth & Firestore, Role-based access",
    description: "Student-startup collaboration platform with verified founder authentication and role-based access control",
    demoUrl: "https://v0-poly-start-connect.vercel.app/",
    githubUrl: "https://github.com/mohamedaslam/polystart-connect",
    notes: "Production startup application"
  },
  {
    id: 3,
    name: "ConnectSPM",
    status: "MVP",
    category: "Web App",
    keyTech: "Next.js, Supabase",
    description: "Student networking platform currently undergoing feature upgrades and optimization",
    notes: "Active development"
  },
  {
    id: 4,
    name: "EcoRamadan Initiative",
    status: "Active",
    category: "Community",
    keyTech: "Volunteer-managed, collection system",
    description: "Community-driven recycling initiative with volunteer coordination and collection logistics"
  },
  {
    id: 18,
    name: "Recenter",
    status: "Active",
    category: "Web App",
    keyTech: "React, PWA",
    description: "Mindfulness and meditation platform with guided sessions and personal journaling",
    demoUrl: "https://v0-recenter.vercel.app/"
  },
  {
    id: 16,
    name: "Mini Library System (ST0509)",
    status: "Active",
    category: "School",
    keyTech: "Java, SQL",
    description: "Console-based library management system demonstrating OOP principles and database integration"
  },
  {
    id: 17,
    name: "Online Shopping System (EP1101 CA1)",
    status: "Active",
    category: "School",
    keyTech: "PostgreSQL, CRUD, Stored Procedures",
    description: "E-commerce system with order management, reviews, and inventory tracking"
  },
  {
    id: 26,
    name: "ConnectSphere",
    status: "Active",
    category: "Web App",
    keyTech: "Next.js, Supabase, AI matchmaking",
    description: "Event networking platform with AI-powered attendee matching and QR-based authentication",
    notes: "Active development"
  },
  // Paused Projects
  {
    id: 5,
    name: "TrustLens",
    status: "Paused",
    category: "Chrome Extension",
    keyTech: "JavaScript, Chrome APIs",
    description: "Browser extension for identifying and filtering misinformation with real-time content analysis",
    notes: "Partially implemented"
  },
  {
    id: 6,
    name: "vent_ai",
    status: "Paused",
    category: "Web App",
    keyTech: "Hugging Face AI models, React",
    description: "Privacy-focused emotional wellness platform using AI for anonymous venting sessions",
    notes: "No data storage implementation"
  },
  {
    id: 7,
    name: "SubGuard",
    status: "Paused",
    category: "Mobile App",
    keyTech: "Flutter, Mobile SDKs",
    description: "Subscription management application for tracking and optimizing recurring payments"
  },
  {
    id: 8,
    name: "GURU AI",
    status: "Paused",
    category: "Web App",
    keyTech: "Video automation, AI scriptwriting",
    description: "AI-powered video generation platform converting text prompts into scripted video content"
  },
  {
    id: 9,
    name: "SilverConnect",
    status: "Paused",
    category: "Web App",
    keyTech: "React, Accessibility Features",
    description: "Senior-friendly digital assistant for banking and telehealth services with enhanced accessibility"
  },
  {
    id: 10,
    name: "StepFresh",
    status: "Paused",
    category: "Product",
    keyTech: "Modular footwear system",
    description: "Sustainable footwear concept with interchangeable modular soles for extended product lifecycle"
  },
  {
    id: 11,
    name: "SnapSweep",
    status: "Paused",
    category: "Mobile App",
    keyTech: "On-device face detection",
    description: "Photo gallery management app using AI-powered face detection for automated organization"
  },
  {
    id: 12,
    name: "HabitLoop",
    status: "Paused",
    category: "Mobile App",
    keyTech: "React Native, Gamified Challenges",
    description: "Social habit-tracking platform with creator-led challenges and community engagement"
  },
  {
    id: 13,
    name: "DevOmegle",
    status: "Paused",
    category: "Web App",
    keyTech: "Node.js, WebRTC",
    description: "Real-time developer networking platform for random peer-to-peer technical discussions"
  },
  {
    id: 14,
    name: "Ascendants",
    status: "Paused",
    category: "Game",
    keyTech: "Roblox Studio",
    description: "Multiplayer RPG game featuring cultivation mechanics and faction-based gameplay"
  },
  {
    id: 15,
    name: "BeachSafe",
    status: "Paused",
    category: "Product",
    keyTech: "Wearables, IoT",
    description: "IoT-based beach safety system with real-time monitoring and emergency alert capabilities"
  },
  {
    id: 27,
    name: "EventureSG",
    status: "Paused",
    category: "Telegram Bot",
    keyTech: "Python, BotFather",
    description: "Telegram bot for event discovery and management with automated notifications",
    notes: "Local development complete"
  },
  // Practice / Hackathon / CCA
  {
    id: 19,
    name: "React Essentials",
    status: "Completed",
    category: "Web App",
    keyTech: "React",
    description: "Learning project focused on React fundamentals and component architecture"
  },
  {
    id: 20,
    name: "DevMegle",
    status: "Completed",
    category: "Hackathon",
    keyTech: "HTML, CSS, JavaScript",
    description: "24-hour hackathon project: developer networking website built during Cursor Hackathon"
  },
  {
    id: 21,
    name: "CyDists Website",
    status: "Completed",
    category: "CCA",
    keyTech: "HTML, CSS, JavaScript",
    description: "Co-curricular activity website development for student organization"
  },
  // Ideas / Concepts
  {
    id: 22,
    name: "CCA Event Management System",
    status: "Idea",
    category: "Web App",
    keyTech: "Planning phase",
    description: "Comprehensive event management platform for co-curricular activities coordination"
  },
  {
    id: 23,
    name: "PolyBuddy",
    status: "Idea",
    category: "Mobile App",
    keyTech: "Planning phase",
    description: "Companion mobile application for polytechnic students with campus navigation and resources"
  },
  // MVP / Previous Work
  {
    id: 24,
    name: "Portfolio V1",
    status: "MVP",
    category: "Web App",
    keyTech: "React, Vercel",
    description: "Initial portfolio website iteration deployed on Vercel platform"
  },
  {
    id: 25,
    name: "Blog Contribution",
    status: "MVP",
    category: "Web App",
    keyTech: "React, HTML, CSS",
    description: "Frontend development contribution to collaborative blog project"
  }
];

export const getProjectsByStatus = (status: ProjectStatus) => {
  return allProjects.filter(p => p.status === status);
};

export const getProjectsByCategory = (category: ProjectCategory) => {
  return allProjects.filter(p => p.category === category);
};

export const getProjectStats = () => {
  const stats = {
    total: allProjects.length,
    active: getProjectsByStatus('Active').length,
    paused: getProjectsByStatus('Paused').length,
    mvp: getProjectsByStatus('MVP').length,
    idea: getProjectsByStatus('Idea').length,
    completed: getProjectsByStatus('Completed').length,
  };
  return stats;
};
