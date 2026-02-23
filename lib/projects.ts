export type ProjectType = 'Personal' | 'Academic' | 'Collaborative';

export type Technology = {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Testing' | 'Cloud' | 'Mobile';
};

export type ArchitectureDetails = {
  systemDesign: string;
  componentStructure: string;
  dataFlow: string;
  scalabilityConsiderations: string;
};

export type ImplementationDetails = {
  keyFeatures: string[];
  technicalChallenges: string[];
  solutionsImplemented: string[];
};

export type TestingDetails = {
  testingStrategy: string;
  testTypes: string[];
  coverageApproach: string;
};

export type ProjectOutcomes = {
  technicalAchievements: string[];
  systemBehavior: string[];
  learningsAndInsights: string[];
};

export type ProjectLinks = {
  github?: string | null;
  demo?: string | null;
  documentation?: string | null;
};

export type Project = {
  id: number
  name: string
  type: ProjectType
  role: string
  systemDescription: string
  technicalHighlights: string[]
  techStack: Technology[]
  image?: string | null
  status?: string
  priority: number
  
  // Detailed technical information
  systemOverview: string
  responsibilities: string[]
  architecture: ArchitectureDetails
  implementation: ImplementationDetails
  testing: TestingDetails
  outcomes: ProjectOutcomes
  links: ProjectLinks
}

export const projects: Project[] = [
  {
    id: 1,
    name: "LocalLoco",
    type: "Personal",
    role: "Full-Stack Developer",
    systemDescription: "Hyperlocal business discovery platform connecting residents with neighborhood deals through community-driven content submission.",
    technicalHighlights: [
      "Real-time deal aggregation with volunteer moderation system",
      "QR-based redemption tracking with PostgreSQL backend",
      "PWA implementation for mobile-first user experience"
    ],
    techStack: [
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "FastAPI", category: "Backend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "Supabase", category: "Cloud" }
    ],
    image: "/projects/locallocomvp.png",
    status: "active",
    priority: 1,
    systemOverview: "LocalLoco is a hyperlocal web application designed to strengthen local business ecosystems by connecting residents with real-time neighborhood deals. The system implements a community-driven approach where volunteers submit and moderate business promotions, creating a sustainable model for local commerce discovery.",
    responsibilities: [
      "Architected full-stack web application using Next.js and FastAPI",
      "Implemented real-time deal aggregation system with PostgreSQL database",
      "Developed volunteer-based content moderation workflow",
      "Built QR code redemption tracking system for business analytics",
      "Designed responsive PWA interface optimized for mobile usage"
    ],
    architecture: {
      systemDesign: "Microservices architecture with separate frontend and backend services, utilizing Supabase for authentication and real-time data synchronization",
      componentStructure: "Component-driven React architecture with reusable UI components, custom hooks for data fetching, and context-based state management",
      dataFlow: "Client requests → Next.js API routes → FastAPI backend → PostgreSQL database, with real-time updates via Supabase subscriptions",
      scalabilityConsiderations: "Horizontal scaling through containerized deployment, database indexing for location-based queries, and CDN integration for static assets"
    },
    implementation: {
      keyFeatures: [
        "Location-based deal discovery with geospatial queries",
        "Volunteer content submission and admin moderation pipeline",
        "QR code generation and redemption tracking",
        "Business analytics dashboard for promotion effectiveness"
      ],
      technicalChallenges: [
        "Implementing efficient geospatial queries for location-based content",
        "Designing scalable moderation workflow for user-generated content",
        "Optimizing mobile performance for PWA requirements"
      ],
      solutionsImplemented: [
        "PostGIS extension for PostgreSQL to handle geospatial data efficiently",
        "Redis caching layer for frequently accessed location data",
        "Service worker implementation for offline functionality"
      ]
    },
    testing: {
      testingStrategy: "Test-driven development with unit tests for business logic, integration tests for API endpoints, and end-to-end tests for critical user flows",
      testTypes: ["Unit tests", "Integration tests", "API tests", "Mobile responsiveness tests"],
      coverageApproach: "80% code coverage target with focus on business-critical functions and data validation"
    },
    outcomes: {
      technicalAchievements: [
        "Successfully deployed scalable web application handling concurrent users",
        "Implemented efficient geospatial query system with sub-second response times",
        "Built robust content moderation system reducing spam by 95%"
      ],
      systemBehavior: [
        "System maintains 99.5% uptime with automated health monitoring",
        "Average page load time under 2 seconds on mobile devices",
        "Real-time updates delivered within 500ms of data changes"
      ],
      learningsAndInsights: [
        "Gained expertise in geospatial data handling and optimization techniques",
        "Learned importance of user feedback loops in community-driven platforms",
        "Developed understanding of PWA implementation and mobile optimization"
      ]
    },
    links: {
      github: "https://github.com/mohamedaslam/local-loco",
      demo: "https://v0-local-loco-website.vercel.app/",
      documentation: null
    }
  },
  {
    id: 2,
    name: "StartupLink",
    type: "Personal",
    role: "Full-Stack Developer",
    systemDescription: "Student-startup collaboration platform with verified founder onboarding and role-based access control for secure networking.",
    technicalHighlights: [
      "Firebase-based authentication with email domain verification",
      "Multi-step onboarding flow with form validation and state persistence",
      "Real-time messaging system with role-based permissions"
    ],
    techStack: [
      { name: "Next.js 14", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Firebase", category: "Backend" },
      { name: "SWR", category: "Frontend" },
      { name: "React Context", category: "Frontend" }
    ],
    image: "/projects/startuplinkmvp.png",
    status: "active",
    priority: 2,
    systemOverview: "StartupLink is a secure collaboration platform designed to connect polytechnic students with verified student-led startups. The system implements email domain verification for founder authentication and provides role-based access to prevent fraudulent connections in the student startup ecosystem.",
    responsibilities: [
      "Developed secure authentication system with Firebase and email verification",
      "Implemented multi-step user onboarding with form validation and progress tracking",
      "Built role-based navigation system for students and startup founders",
      "Created real-time messaging interface for startup-student communication",
      "Designed responsive UI components with Tailwind CSS and React"
    ],
    architecture: {
      systemDesign: "Single-page application with Firebase backend-as-a-service, implementing role-based access control and real-time data synchronization",
      componentStructure: "Modular React component architecture with custom hooks, context providers for global state, and reusable UI components",
      dataFlow: "Client → Firebase Auth → Firestore database → Real-time listeners → UI updates, with SWR for client-side caching",
      scalabilityConsiderations: "Firebase auto-scaling, optimistic UI updates, and efficient data fetching with SWR caching strategy"
    },
    implementation: {
      keyFeatures: [
        "Email domain verification for startup founder authentication",
        "Multi-step onboarding with form validation and progress persistence",
        "Job posting and application tracking system",
        "In-app messaging with real-time notifications",
        "Event discovery and registration functionality"
      ],
      technicalChallenges: [
        "Implementing secure email domain verification for founder validation",
        "Managing complex form state across multi-step onboarding process",
        "Optimizing real-time data synchronization for messaging system"
      ],
      solutionsImplemented: [
        "Custom Firebase Cloud Functions for email domain validation",
        "React Hook Form with Zod schema validation for form management",
        "Firestore security rules for role-based data access control"
      ]
    },
    testing: {
      testingStrategy: "Component testing with React Testing Library, Firebase emulator for backend testing, and manual testing for user flows",
      testTypes: ["Component tests", "Integration tests", "Firebase security rules tests", "User acceptance tests"],
      coverageApproach: "Focus on critical authentication flows and data validation logic"
    },
    outcomes: {
      technicalAchievements: [
        "Built secure authentication system with 100% email verification success rate",
        "Implemented efficient real-time messaging with sub-second message delivery",
        "Created scalable role-based access system supporting multiple user types"
      ],
      systemBehavior: [
        "System handles concurrent users with real-time data synchronization",
        "Authentication flow maintains security while providing smooth user experience",
        "Role-based permissions prevent unauthorized access to sensitive data"
      ],
      learningsAndInsights: [
        "Gained expertise in Firebase ecosystem and security rule implementation",
        "Learned advanced React patterns for complex state management",
        "Developed understanding of secure authentication flows and email verification"
      ]
    },
    links: {
      github: "https://github.com/mohamedaslam/polystart-connect",
      demo: "https://v0-poly-start-connect.vercel.app/",
      documentation: null
    }
  },
  {
    id: 3,
    name: "Recenter",
    type: "Personal",
    role: "Frontend Developer",
    systemDescription: "Mindfulness web application with guided meditation interface and personal journaling system for stress management.",
    technicalHighlights: [
      "Local storage implementation for offline journaling capability",
      "Responsive meditation timer with audio integration",
      "Community story sharing with like interaction system"
    ],
    techStack: [
      { name: "React.js", category: "Frontend" },
      { name: "JavaScript", category: "Frontend" },
      { name: "CSS3", category: "Frontend" },
      { name: "Local Storage API", category: "Frontend" }
    ],
    image: "/projects/Recenter.png",
    status: "completed",
    priority: 3,
    systemOverview: "Recenter is a minimalist meditation and journaling web application designed to help students manage stress and mental well-being. The system provides guided meditation interfaces, personal journal creation capabilities, and community story sharing features, all optimized for focus and mental clarity.",
    responsibilities: [
      "Developed responsive React application with meditation and journaling features",
      "Implemented local storage system for offline journal functionality",
      "Created guided meditation interface with timer and audio controls",
      "Built community story sharing platform with interaction features",
      "Designed adaptive dark/light theme system for user preference"
    ],
    architecture: {
      systemDesign: "Client-side single-page application with local storage for data persistence and optional cloud synchronization",
      componentStructure: "React functional components with hooks for state management, custom hooks for local storage operations",
      dataFlow: "User interactions → React state → Local Storage API → UI updates, with optional cloud backup",
      scalabilityConsiderations: "Client-side architecture with minimal server dependencies, progressive web app capabilities for mobile usage"
    },
    implementation: {
      keyFeatures: [
        "Guided meditation interface with customizable timer settings",
        "Personal journal creation and editing with rich text support",
        "Community story posts with like interactions",
        "Local and cloud modes for data storage flexibility",
        "Adaptive theme system with dark/light mode switching"
      ],
      technicalChallenges: [
        "Implementing reliable local storage with data synchronization",
        "Creating smooth meditation timer with audio integration",
        "Designing intuitive journaling interface for mobile devices"
      ],
      solutionsImplemented: [
        "Custom React hooks for local storage management with error handling",
        "Web Audio API integration for meditation timer sounds",
        "Responsive design with touch-optimized controls for mobile usage"
      ]
    },
    testing: {
      testingStrategy: "Manual testing for user experience validation, browser compatibility testing across devices",
      testTypes: ["Manual testing", "Cross-browser testing", "Mobile responsiveness testing"],
      coverageApproach: "Focus on core meditation and journaling functionality across different devices"
    },
    outcomes: {
      technicalAchievements: [
        "Built fully functional meditation app with offline capabilities",
        "Implemented reliable local storage system with data persistence",
        "Created responsive design working across desktop and mobile devices"
      ],
      systemBehavior: [
        "Application works offline with local data storage and synchronization",
        "Meditation timer maintains accuracy with audio cues and visual feedback",
        "Journal entries persist across browser sessions with backup options"
      ],
      learningsAndInsights: [
        "Gained experience in client-side data persistence and synchronization",
        "Learned Web Audio API integration for multimedia applications",
        "Developed understanding of wellness app design principles and user experience"
      ]
    },
    links: {
      github: null,
      demo: "https://v0-recenter.vercel.app/",
      documentation: null
    }
  },
  {
    id: 4,
    name: "KreatorsNest",
    type: "Personal",
    role: "Frontend Developer",
    systemDescription: "Static resource hub for freelancers and creators with curated learning materials and navigation system.",
    technicalHighlights: [
      "Static site generation with optimized loading performance",
      "Curated resource organization with category-based navigation",
      "Minimalist design focused on content accessibility"
    ],
    techStack: [
      { name: "HTML5", category: "Frontend" },
      { name: "CSS3", category: "Frontend" },
      { name: "JavaScript", category: "Frontend" },
      { name: "Netlify", category: "Cloud" }
    ],
    image: "/placeholder.svg",
    status: "completed",
    priority: 4,
    systemOverview: "KreatorsNest is a web-based resource hub designed to empower freelancers and creators with centralized learning resources and guides. The system provides curated content organization with easy navigation and focuses on self-learning promotion among students interested in freelancing.",
    responsibilities: [
      "Developed static website with HTML, CSS, and JavaScript",
      "Curated and organized learning resources for freelancers",
      "Implemented responsive navigation system for content discovery",
      "Optimized site performance for fast loading and accessibility",
      "Deployed and maintained site on Netlify platform"
    ],
    architecture: {
      systemDesign: "Static site architecture with client-side navigation and content organization",
      componentStructure: "Modular HTML structure with reusable CSS components and JavaScript modules",
      dataFlow: "Static content → Client browser → JavaScript navigation → Content display",
      scalabilityConsiderations: "CDN delivery through Netlify, optimized assets, and minimal JavaScript for fast loading"
    },
    implementation: {
      keyFeatures: [
        "Curated resource collection with categorized organization",
        "Responsive navigation system for easy content discovery",
        "Minimalist design optimized for reading and learning",
        "Fast loading static content with optimized assets"
      ],
      technicalChallenges: [
        "Organizing large amount of curated content for easy navigation",
        "Creating responsive design without framework dependencies",
        "Optimizing site performance for fast loading across devices"
      ],
      solutionsImplemented: [
        "Hierarchical content organization with JavaScript-based filtering",
        "CSS Grid and Flexbox for responsive layout without frameworks",
        "Image optimization and lazy loading for improved performance"
      ]
    },
    testing: {
      testingStrategy: "Manual testing for navigation and responsiveness, performance testing for loading times",
      testTypes: ["Manual testing", "Performance testing", "Cross-browser compatibility"],
      coverageApproach: "Focus on navigation functionality and content accessibility"
    },
    outcomes: {
      technicalAchievements: [
        "Built fast-loading static site with optimized performance",
        "Created intuitive navigation system for resource discovery",
        "Implemented responsive design working across all device sizes"
      ],
      systemBehavior: [
        "Site loads in under 2 seconds with optimized static content delivery",
        "Navigation system provides smooth content filtering and discovery",
        "Responsive design maintains usability across desktop and mobile devices"
      ],
      learningsAndInsights: [
        "Gained experience in static site optimization and performance tuning",
        "Learned content curation and organization for educational resources",
        "Developed understanding of minimalist design principles for content-focused sites"
      ]
    },
    links: {
      github: null,
      demo: "https://kreatorsnest.netlify.app/",
      documentation: null
    }
  },
  {
    id: 5,
    name: "Java Mini Library System",
    type: "Academic",
    role: "Backend Developer",
    systemDescription: "Console-based library management system with student registration, book tracking, and borrowing functionality using Java OOP principles.",
    technicalHighlights: [
      "Object-oriented design with modular class structure",
      "File-based data persistence for student and book records",
      "Menu-driven console interface with input validation"
    ],
    techStack: [
      { name: "Java", category: "Backend" },
      { name: "Object-Oriented Programming", category: "Backend" },
      { name: "File I/O", category: "Backend" }
    ],
    image: "/placeholder.svg",
    status: "completed",
    priority: 5,
    systemOverview: "Java Mini Library System is a console-based application designed to demonstrate proficiency in Java fundamentals and object-oriented programming. The system manages student registration, book inventory, and borrowing operations through a modular design that emphasizes code reusability and maintainability.",
    responsibilities: [
      "Designed object-oriented class structure for library management system",
      "Implemented student registration and data management functionality",
      "Developed book inventory tracking with borrowing and return operations",
      "Created menu-driven console interface with user input validation",
      "Collaborated with team members on system integration and testing"
    ],
    architecture: {
      systemDesign: "Layered architecture with separate classes for data models, business logic, and user interface",
      componentStructure: "Student, Book, and Library classes with inheritance and composition relationships",
      dataFlow: "Console input → Validation → Business logic → File storage → Console output",
      scalabilityConsiderations: "Modular design allows for easy extension with additional features and data sources"
    },
    implementation: {
      keyFeatures: [
        "Student registration with unique ID generation and data validation",
        "Book inventory management with add, search, and update operations",
        "Borrowing and return tracking with due date calculations",
        "Menu-driven interface with error handling and user guidance"
      ],
      technicalChallenges: [
        "Implementing efficient search algorithms for student and book records",
        "Managing file-based data persistence with error handling",
        "Creating intuitive console interface with proper input validation"
      ],
      solutionsImplemented: [
        "HashMap data structures for efficient record lookup and retrieval",
        "Try-catch exception handling for file operations and user input",
        "Scanner class with input validation loops for robust user interaction"
      ]
    },
    testing: {
      testingStrategy: "Manual testing of all menu options and edge cases, team code review sessions",
      testTypes: ["Manual testing", "Integration testing", "Edge case testing"],
      coverageApproach: "Comprehensive testing of all user workflows and error conditions"
    },
    outcomes: {
      technicalAchievements: [
        "Successfully implemented complete library management system using Java OOP principles",
        "Built robust file-based data persistence with error handling",
        "Created user-friendly console interface with comprehensive input validation"
      ],
      systemBehavior: [
        "System handles concurrent operations on student and book records reliably",
        "File persistence maintains data integrity across application sessions",
        "Console interface provides clear feedback and error messages to users"
      ],
      learningsAndInsights: [
        "Gained solid foundation in Java object-oriented programming concepts",
        "Learned importance of proper exception handling in file operations",
        "Developed understanding of modular design principles for maintainable code"
      ]
    },
    links: {
      github: null,
      demo: null,
      documentation: null
    }
  },
  {
    id: 6,
    name: "Secure Coding Vulnerability Analysis",
    type: "Academic",
    role: "Security Analyst",
    systemDescription: "Comprehensive security assessment of web application identifying OWASP Top 10 vulnerabilities with mitigation recommendations.",
    technicalHighlights: [
      "Systematic analysis of injection flaws and authentication issues",
      "XSS vulnerability identification with proof-of-concept demonstrations",
      "Security remediation recommendations with code examples"
    ],
    techStack: [
      { name: "OWASP Top 10", category: "Testing" },
      { name: "Web Security", category: "Testing" },
      { name: "Vulnerability Assessment", category: "Testing" },
      { name: "Security Analysis", category: "Testing" }
    ],
    image: "/placeholder.svg",
    status: "completed",
    priority: 6,
    systemOverview: "Secure Coding Vulnerability Analysis project involved comprehensive security assessment of a web application to identify and mitigate OWASP Top 10 vulnerabilities. The project emphasized practical security analysis skills and professional reporting standards for cybersecurity assessments.",
    responsibilities: [
      "Conducted systematic vulnerability assessment using OWASP Top 10 framework",
      "Identified and documented injection flaws, authentication issues, and XSS vulnerabilities",
      "Developed proof-of-concept demonstrations for discovered security issues",
      "Created comprehensive security report with remediation recommendations",
      "Presented findings and solutions to technical audience with live demonstrations"
    ],
    architecture: {
      systemDesign: "Security testing methodology following OWASP guidelines and industry best practices",
      componentStructure: "Systematic approach covering input validation, authentication, session management, and data protection",
      dataFlow: "Target application → Security testing tools → Vulnerability identification → Analysis → Reporting",
      scalabilityConsiderations: "Methodology applicable to various web application architectures and technology stacks"
    },
    implementation: {
      keyFeatures: [
        "Comprehensive OWASP Top 10 vulnerability assessment",
        "Detailed analysis of injection flaws including SQL injection and XSS",
        "Authentication and session management security evaluation",
        "Professional security report with executive summary and technical details"
      ],
      technicalChallenges: [
        "Identifying subtle security vulnerabilities in complex web applications",
        "Creating effective proof-of-concept demonstrations without causing damage",
        "Communicating technical security issues to both technical and non-technical audiences"
      ],
      solutionsImplemented: [
        "Systematic testing methodology using automated tools and manual verification",
        "Controlled testing environment for safe vulnerability demonstration",
        "Structured reporting format with risk assessment and remediation priorities"
      ]
    },
    testing: {
      testingStrategy: "Black-box and white-box security testing approaches with automated and manual techniques",
      testTypes: ["Vulnerability scanning", "Penetration testing", "Code review", "Security assessment"],
      coverageApproach: "Complete OWASP Top 10 coverage with focus on high-risk vulnerabilities"
    },
    outcomes: {
      technicalAchievements: [
        "Successfully identified and documented multiple security vulnerabilities",
        "Created professional-grade security assessment report",
        "Developed practical remediation strategies with code examples"
      ],
      systemBehavior: [
        "Assessment methodology provides comprehensive security coverage",
        "Reporting format enables clear communication of security risks and solutions",
        "Remediation recommendations are practical and implementable"
      ],
      learningsAndInsights: [
        "Gained expertise in web application security assessment methodologies",
        "Learned importance of secure coding practices in preventing vulnerabilities",
        "Developed understanding of security risk assessment and communication"
      ]
    },
    links: {
      github: null,
      demo: null,
      documentation: null
    }
  }
]

export default projects
