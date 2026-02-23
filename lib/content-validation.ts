/**
 * Content validation utilities for portfolio refactoring
 * Ensures professional, engineering-focused language throughout the portfolio
 */

// Inspirational keywords that should be avoided in professional content
const INSPIRATIONAL_KEYWORDS = [
  'journey', 'transformation', 'passion', 'dream', 'vision', 'inspire', 'amazing',
  'incredible', 'extraordinary', 'revolutionary', 'game-changing', 'breakthrough',
  'visionary', 'innovative solutions', 'cutting-edge', 'next-generation',
  'paradigm shift', 'disruptive', 'groundbreaking', 'world-class'
];

// Marketing buzzwords that should be avoided
const MARKETING_BUZZWORDS = [
  'synergy', 'leverage', 'optimize', 'maximize', 'streamline', 'revolutionize',
  'game-changer', 'best-in-class', 'industry-leading', 'state-of-the-art',
  'bleeding-edge', 'turnkey solution', 'seamless integration', 'robust platform',
  'scalable solution', 'enterprise-grade', 'mission-critical', 'value-added'
];

// Emotional/transformational narrative keywords
const EMOTIONAL_KEYWORDS = [
  'struggled', 'overcome', 'challenges', 'growth mindset', 'personal development',
  'life-changing', 'empowering', 'fulfilling', 'rewarding', 'meaningful',
  'passionate about', 'excited to', 'thrilled', 'delighted', 'honored'
];

// Exaggerated titles that should be avoided
const EXAGGERATED_TITLES = [
  'ceo', 'chief executive officer', 'visionary', 'entrepreneur', 'founder',
  'co-founder', 'thought leader', 'industry expert', 'guru', 'ninja',
  'rockstar', 'wizard', 'maven', 'evangelist'
];

// Engineering terminology that should be present
const ENGINEERING_TERMS = [
  'system', 'architecture', 'implementation', 'scalability', 'performance',
  'testing', 'deployment', 'integration', 'api', 'database', 'framework',
  'component', 'module', 'interface', 'protocol', 'algorithm', 'data structure',
  'optimization', 'debugging', 'refactoring', 'version control', 'ci/cd'
];

// Specific technology names (examples)
const SPECIFIC_TECHNOLOGIES = [
  'react.js', 'typescript', 'next.js', 'node.js', 'postgresql', 'mongodb', 'javascript',
  'docker', 'kubernetes', 'aws', 'azure', 'git', 'jest', 'cypress', 'html',
  'tailwind css', 'express', 'fastapi', 'redis', 'graphql', 'rest api','css'
];

/**
 * Validates that content avoids inspirational language
 */
export function validateProfessionalLanguage(content: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for inspirational keywords
  INSPIRATIONAL_KEYWORDS.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      issues.push(`Contains inspirational keyword: "${keyword}"`);
    }
  });

  // Check for marketing buzzwords
  MARKETING_BUZZWORDS.forEach(buzzword => {
    if (lowerContent.includes(buzzword.toLowerCase())) {
      issues.push(`Contains marketing buzzword: "${buzzword}"`);
    }
  });

  // Check for emotional keywords
  EMOTIONAL_KEYWORDS.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      issues.push(`Contains emotional keyword: "${keyword}"`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Validates that content uses engineering terminology
 */
export function validateEngineeringTerminology(content: string): {
  isValid: boolean;
  engineeringTermsFound: string[];
  suggestions: string[];
} {
  const lowerContent = content.toLowerCase();
  const engineeringTermsFound: string[] = [];
  const suggestions: string[] = [];

  // Check for engineering terms
  ENGINEERING_TERMS.forEach(term => {
    if (lowerContent.includes(term.toLowerCase())) {
      engineeringTermsFound.push(term);
    }
  });

  // Provide suggestions if no engineering terms found
  if (engineeringTermsFound.length === 0) {
    suggestions.push('Consider adding technical terms like: system, architecture, implementation, testing');
  }

  return {
    isValid: engineeringTermsFound.length > 0,
    engineeringTermsFound,
    suggestions
  };
}

/**
 * Validates that technology references are specific rather than generic
 */
export function validateSpecificTechnology(content: string): {
  isValid: boolean;
  specificTechnologies: string[];
  genericTermsFound: string[];
} {
  const lowerContent = content.toLowerCase();
  const specificTechnologies: string[] = [];
  const genericTermsFound: string[] = [];

  // Check for specific technologies
  SPECIFIC_TECHNOLOGIES.forEach(tech => {
    if (lowerContent.includes(tech.toLowerCase())) {
      specificTechnologies.push(tech);
    }
  });

  // Check for generic terms that should be replaced
  const genericTerms = ['frontend', 'backend', 'database', 'cloud', 'framework'];
  genericTerms.forEach(term => {
    if (lowerContent.includes(term) && !lowerContent.includes(`${term} (`) && !lowerContent.includes(`${term}:`)) {
      genericTermsFound.push(term);
    }
  });

  return {
    isValid: specificTechnologies.length > 0 && genericTermsFound.length === 0,
    specificTechnologies,
    genericTermsFound
  };
}

/**
 * Validates that role titles are realistic and not exaggerated
 */
export function validateRealisticRoles(content: string): {
  isValid: boolean;
  exaggeratedTitles: string[];
} {
  const lowerContent = content.toLowerCase();
  const exaggeratedTitles: string[] = [];

  EXAGGERATED_TITLES.forEach(title => {
    if (lowerContent.includes(title)) {
      exaggeratedTitles.push(title);
    }
  });

  return {
    isValid: exaggeratedTitles.length === 0,
    exaggeratedTitles
  };
}

/**
 * Validates content structure for scannability
 */
export function validateContentStructure(content: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check paragraph length (should be under 150 words)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.split(' ').length > 150);
  
  if (longParagraphs.length > 0) {
    issues.push(`${longParagraphs.length} paragraph(s) exceed 150 words`);
    suggestions.push('Break long paragraphs into shorter, scannable sections');
  }

  // Check for bullet points or lists
  const hasBulletPoints = content.includes('•') || content.includes('-') || content.includes('*');
  const hasNumberedLists = /\d+\./.test(content);
  
  if (!hasBulletPoints && !hasNumberedLists && content.length > 500) {
    suggestions.push('Consider using bullet points or lists for better scannability');
  }

  // Check for headings
  const hasHeadings = content.includes('#') || content.includes('##');
  if (!hasHeadings && content.length > 300) {
    suggestions.push('Consider adding headings to improve information hierarchy');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Comprehensive content validation for professional portfolio content
 */
export function validatePortfolioContent(content: string): {
  isValid: boolean;
  professionalLanguage: ReturnType<typeof validateProfessionalLanguage>;
  engineeringTerminology: ReturnType<typeof validateEngineeringTerminology>;
  specificTechnology: ReturnType<typeof validateSpecificTechnology>;
  realisticRoles: ReturnType<typeof validateRealisticRoles>;
  contentStructure: ReturnType<typeof validateContentStructure>;
} {
  const professionalLanguage = validateProfessionalLanguage(content);
  const engineeringTerminology = validateEngineeringTerminology(content);
  const specificTechnology = validateSpecificTechnology(content);
  const realisticRoles = validateRealisticRoles(content);
  const contentStructure = validateContentStructure(content);

  const isValid = 
    professionalLanguage.isValid &&
    engineeringTerminology.isValid &&
    specificTechnology.isValid &&
    realisticRoles.isValid &&
    contentStructure.isValid;

  return {
    isValid,
    professionalLanguage,
    engineeringTerminology,
    specificTechnology,
    realisticRoles,
    contentStructure
  };
}

/**
 * System design keywords that should be present in technical content
 */
const SYSTEM_DESIGN_KEYWORDS = [
  'architecture', 'design pattern', 'microservices', 'monolith', 'distributed system',
  'load balancing', 'caching', 'database design', 'data modeling', 'api design',
  'scalability', 'performance', 'reliability', 'availability', 'consistency',
  'fault tolerance', 'error handling', 'monitoring', 'logging', 'metrics'
];

/**
 * Technical implementation keywords
 */
const IMPLEMENTATION_KEYWORDS = [
  'implementation', 'development', 'coding', 'programming', 'algorithm',
  'data structure', 'optimization', 'refactoring', 'debugging', 'testing',
  'unit test', 'integration test', 'end-to-end test', 'code review',
  'version control', 'git', 'ci/cd', 'deployment', 'build process'
];

/**
 * Modern development patterns and practices
 */
const MODERN_DEV_PATTERNS = [
  'component-driven', 'test-driven development', 'behavior-driven development',
  'agile', 'scrum', 'kanban', 'continuous integration', 'continuous deployment',
  'devops', 'infrastructure as code', 'containerization', 'docker', 'kubernetes',
  'serverless', 'cloud-native', 'microservices', 'event-driven architecture'
];

/**
 * Validates that content includes system design concepts
 */
export function validateSystemDesignContent(content: string): {
  isValid: boolean;
  systemDesignTerms: string[];
  suggestions: string[];
} {
  const lowerContent = content.toLowerCase();
  const systemDesignTerms: string[] = [];
  const suggestions: string[] = [];

  SYSTEM_DESIGN_KEYWORDS.forEach(term => {
    if (lowerContent.includes(term.toLowerCase())) {
      systemDesignTerms.push(term);
    }
  });

  if (systemDesignTerms.length === 0) {
    suggestions.push('Consider adding system design concepts like: architecture, scalability, performance, or design patterns');
  }

  return {
    isValid: systemDesignTerms.length > 0,
    systemDesignTerms,
    suggestions
  };
}

/**
 * Validates that content includes technical implementation details
 */
export function validateImplementationDetails(content: string): {
  isValid: boolean;
  implementationTerms: string[];
  suggestions: string[];
} {
  const lowerContent = content.toLowerCase();
  const implementationTerms: string[] = [];
  const suggestions: string[] = [];

  IMPLEMENTATION_KEYWORDS.forEach(term => {
    if (lowerContent.includes(term.toLowerCase())) {
      implementationTerms.push(term);
    }
  });

  if (implementationTerms.length === 0) {
    suggestions.push('Consider adding implementation details like: development process, testing approach, or technical challenges solved');
  }

  return {
    isValid: implementationTerms.length > 0,
    implementationTerms,
    suggestions
  };
}

/**
 * Validates that content demonstrates modern development practices
 */
export function validateModernDevPractices(content: string): {
  isValid: boolean;
  modernPractices: string[];
  suggestions: string[];
} {
  const lowerContent = content.toLowerCase();
  const modernPractices: string[] = [];
  const suggestions: string[] = [];

  MODERN_DEV_PATTERNS.forEach(practice => {
    if (lowerContent.includes(practice.toLowerCase())) {
      modernPractices.push(practice);
    }
  });

  if (modernPractices.length === 0) {
    suggestions.push('Consider mentioning modern practices like: component-driven development, CI/CD, containerization, or cloud-native approaches');
  }

  return {
    isValid: modernPractices.length > 0,
    modernPractices,
    suggestions
  };
}

/**
 * Validates that content focuses on technical solutions rather than visual descriptions
 */
export function validateTechnicalFocus(content: string): {
  isValid: boolean;
  visualDescriptions: string[];
  technicalSolutions: string[];
} {
  const lowerContent = content.toLowerCase();
  const visualDescriptions: string[] = [];
  const technicalSolutions: string[] = [];

  // Visual description keywords to avoid
  const visualKeywords = [
    'beautiful', 'stunning', 'elegant', 'sleek', 'modern design', 'user-friendly interface',
    'intuitive design', 'visually appealing', 'attractive', 'polished', 'clean design',
    'responsive design', 'mobile-friendly', 'animations', 'transitions', 'visual effects'
  ];

  // Technical solution keywords that should be present
  const technicalKeywords = [
    'algorithm', 'data structure', 'optimization', 'performance improvement',
    'scalability solution', 'error handling', 'fault tolerance', 'caching strategy',
    'database optimization', 'api design', 'security implementation', 'testing strategy'
  ];

  visualKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      visualDescriptions.push(keyword);
    }
  });

  technicalKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      technicalSolutions.push(keyword);
    }
  });

  return {
    isValid: visualDescriptions.length === 0 && technicalSolutions.length > 0,
    visualDescriptions,
    technicalSolutions
  };
}

/**
 * Validates that content includes testing and quality assurance considerations
 */
export function validateTestingContent(content: string): {
  isValid: boolean;
  testingTerms: string[];
  suggestions: string[];
} {
  const lowerContent = content.toLowerCase();
  const testingTerms: string[] = [];
  const suggestions: string[] = [];

  const testingKeywords = [
    'testing', 'unit test', 'integration test', 'end-to-end test', 'test coverage',
    'test-driven development', 'behavior-driven development', 'quality assurance',
    'code review', 'static analysis', 'linting', 'type checking', 'validation'
  ];

  testingKeywords.forEach(term => {
    if (lowerContent.includes(term.toLowerCase())) {
      testingTerms.push(term);
    }
  });

  if (testingTerms.length === 0) {
    suggestions.push('Consider adding testing considerations like: unit testing, integration testing, or quality assurance practices');
  }

  return {
    isValid: testingTerms.length > 0,
    testingTerms,
    suggestions
  };
}

/**
 * Comprehensive technical content validation
 */
export function validateTechnicalContent(content: string): {
  isValid: boolean;
  systemDesign: ReturnType<typeof validateSystemDesignContent>;
  implementation: ReturnType<typeof validateImplementationDetails>;
  modernPractices: ReturnType<typeof validateModernDevPractices>;
  technicalFocus: ReturnType<typeof validateTechnicalFocus>;
  testing: ReturnType<typeof validateTestingContent>;
} {
  const systemDesign = validateSystemDesignContent(content);
  const implementation = validateImplementationDetails(content);
  const modernPractices = validateModernDevPractices(content);
  const technicalFocus = validateTechnicalFocus(content);
  const testing = validateTestingContent(content);

  const isValid = 
    systemDesign.isValid &&
    implementation.isValid &&
    modernPractices.isValid &&
    technicalFocus.isValid &&
    testing.isValid;

  return {
    isValid,
    systemDesign,
    implementation,
    modernPractices,
    technicalFocus,
    testing
  };
}