/**
 * Professional profile data structures for portfolio
 * Focuses on technical capabilities and engineering experience
 */

export type SkillProficiency = 'Proficient' | 'Experienced' | 'Advanced';

export type SkillCategory = {
  category: string;
  technologies: Technology[];
  proficiencyLevel: SkillProficiency;
};

export type Technology = {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Testing' | 'Cloud' | 'Mobile' | 'Desktop';
  yearsOfExperience?: number;
};

export type ContactInfo = {
  email: string;
  linkedin: string;
  github: string;
  location: string;
};

export type ProfessionalProfile = {
  role: string;
  focusAreas: string[];
  technicalSkills: SkillCategory[];
  professionalStatement: string;
  contactInformation: ContactInfo;
  yearsOfExperience: number;
  education: EducationInfo;
};

export type EducationInfo = {
  degree: string;
  institution: string;
  period: string;
  relevantCoursework: string[];
};

// Professional profile data
export const professionalProfile: ProfessionalProfile = {
  role: "Full-Stack Developer",
  focusAreas: [
    "Web systems development",
    "Cloud-backed applications", 
    "Testing and quality assurance",
    "Iterative development processes"
  ],
  technicalSkills: [
    {
      category: "Frontend Development",
      proficiencyLevel: "Advanced",
      technologies: [
        { name: "React.js", category: "Frontend", yearsOfExperience: 2 },
        { name: "Next.js", category: "Frontend", yearsOfExperience: 2 },
        { name: "TypeScript", category: "Frontend", yearsOfExperience: 2 },
        { name: "Tailwind CSS", category: "Frontend", yearsOfExperience: 2 },
        { name: "HTML5", category: "Frontend", yearsOfExperience: 2 },
        { name: "CSS3", category: "Frontend", yearsOfExperience: 2 },
        { name: "JavaScript", category: "Frontend", yearsOfExperience: 2 }
      ]
    },
    {
      category: "Backend Development", 
      proficiencyLevel: "Experienced",
      technologies: [
        { name: "Node.js", category: "Backend", yearsOfExperience: 2 },
        { name: "Express.js", category: "Backend", yearsOfExperience: 2 },
        { name: "FastAPI", category: "Backend", yearsOfExperience: 1 },
        { name: "Java", category: "Backend", yearsOfExperience: 1 },
        { name: "REST APIs", category: "Backend", yearsOfExperience: 2 }
      ]
    },
    {
      category: "Database Systems",
      proficiencyLevel: "Experienced", 
      technologies: [
        { name: "PostgreSQL", category: "Database", yearsOfExperience: 2 },
        { name: "Firebase Firestore", category: "Database", yearsOfExperience: 1 },
        { name: "Supabase", category: "Database", yearsOfExperience: 1 },
        { name: "SQL", category: "Database", yearsOfExperience: 2 }
      ]
    },
    {
      category: "Cloud & DevOps",
      proficiencyLevel: "Proficient",
      technologies: [
        { name: "Vercel", category: "Cloud", yearsOfExperience: 2 },
        { name: "Netlify", category: "Cloud", yearsOfExperience: 1 },
        { name: "Firebase", category: "Cloud", yearsOfExperience: 1 },
        { name: "Google Cloud Platform", category: "Cloud", yearsOfExperience: 1 },
        { name: "Git", category: "DevOps", yearsOfExperience: 2 },
        { name: "GitHub Actions", category: "DevOps", yearsOfExperience: 1 }
      ]
    },
    {
      category: "Testing & Quality Assurance",
      proficiencyLevel: "Proficient",
      technologies: [
        { name: "Jest", category: "Testing", yearsOfExperience: 1 },
        { name: "React Testing Library", category: "Testing", yearsOfExperience: 1 },
        { name: "Manual Testing", category: "Testing", yearsOfExperience: 2 },
        { name: "Security Testing", category: "Testing", yearsOfExperience: 1 }
      ]
    }
  ],
  professionalStatement: "Full-stack developer with experience building web systems using modern JavaScript frameworks and cloud-backed architectures. Focus on component-driven development, testing practices, and iterative improvement processes. Experience with both personal projects and academic coursework in system design, security analysis, and production deployment considerations.",
  contactInformation: {
    email: "aslam040607@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohamed-aslam-abdul",
    github: "https://github.com/TeckTinkerere", 
    location: "Singapore"
  },
  yearsOfExperience: 2,
  education: {
    degree: "Diploma in Information Technology",
    institution: "Singapore Polytechnic",
    period: "2023 - Present",
    relevantCoursework: [
      "Object-Oriented Programming (Java)",
      "Web Development (HTML, CSS, JavaScript)",
      "Database Systems (PostgreSQL, MySQL)",
      "Secure Coding Practices",
      "System Analysis and Design",
      "Software Testing and Quality Assurance (Scrum, Agile Flow)"
    ]
  }
};

// Technical experience summary
export const technicalExperience = {
  personalProjects: 4,
  academicProjects: 2,
  totalLinesOfCode: "50,000+",
  technologiesUsed: 20,
  deployedApplications: 6,
  githubContributions: "500+",
  systemsBuilt: [
    "Hyperlocal business discovery platform",
    "Student-startup collaboration system", 
    "Mindfulness and journaling application",
    "Static resource hub for freelancers",
    "Library management system",
    "Security vulnerability assessment"
  ]
};

export default professionalProfile;