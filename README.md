<div align="center">

# 🚀 Mohamed Aslam's Portfolio

### Professional Full-Stack Developer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)

[View Live Demo](https://your-portfolio-url.vercel.app) • [Report Bug](https://github.com/TeckTinkerere/myportfolio/issues) • [Request Feature](https://github.com/TeckTinkerere/myportfolio/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Portfolio Sections](#-portfolio-sections)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

A modern, professional portfolio website showcasing full-stack development expertise, technical projects, certifications, and professional achievements. Built with Next.js 15, TypeScript, and Tailwind CSS, featuring a sleek dark theme with gradient accents and smooth animations.

### ✨ Highlights

- 🎨 **Modern Design**: Gradient-based dark theme with cyan and purple accents
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- ⚡ **Performance Optimized**: Fast loading times with Next.js SSR and SSG
- 🔍 **SEO Ready**: Optimized for search engines with proper meta tags
- ♿ **Accessible**: WCAG compliant with keyboard navigation support
- 🎭 **Interactive**: Smooth animations and transitions throughout

---

## 🌟 Features

### Core Features

- **Dynamic Project Showcase**: 27+ projects organized by status and category
- **Advanced Filtering**: Real-time search and filter by status, category, and technology
- **Responsive Navigation**: Mobile-optimized menu with smooth transitions
- **Dark/Light Theme**: Theme toggle with system preference detection
- **Newsletter Integration**: Email subscription modal for updates
- **Contact Form**: Professional contact form with validation

### Technical Features

- **Server-Side Rendering**: Fast initial page loads with Next.js SSR
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Type Safety**: Full TypeScript implementation for reliability
- **Component Library**: Reusable UI components with Shadcn/ui
- **Form Validation**: React Hook Form with Zod schema validation
- **Testing Suite**: Jest and React Testing Library integration

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with SSR/SSG |
| **React 19** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Shadcn/ui** | Accessible component library |
| **Lucide React** | Modern icon library |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Jest** | Unit testing framework |
| **React Testing Library** | Component testing |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

### UI Components

- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Sonner**: Toast notifications

---

## 📁 Project Structure

```
portfolio/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── skills/                   # Skills page
│   ├── projects/                 # Featured projects page
│   ├── all-projects/             # Complete portfolio page
│   ├── hall-of-fame/             # Certifications page
│   ├── visionary-wall/           # Testimonials page
│   └── contact/                  # Contact page
│
├── components/                   # React components
│   ├── navbar.tsx                # Navigation bar
│   ├── footer.tsx                # Site footer
│   ├── newsletter-modal.tsx      # Newsletter subscription
│   ├── project-card.tsx          # Project display card
│   ├── theme-provider.tsx        # Theme context
│   ├── pages/                    # Page-specific components
│   │   ├── home.tsx
│   │   ├── projects.tsx
│   │   ├── all-projects.tsx
│   │   ├── skills.tsx
│   │   ├── hall-of-fame.tsx
│   │   ├── visionary-wall.tsx
│   │   └── contact.tsx
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       └── ... (50+ components)
│
├── lib/                          # Utility functions and data
│   ├── projects.ts               # Featured projects data
│   ├── all-projects.ts           # Complete project portfolio
│   ├── professional-profile.ts   # Profile information
│   ├── content-validation.ts     # Content validation
│   └── utils.ts                  # Helper functions
│
├── public/                       # Static assets
│   ├── certificates/             # Certification images
│   ├── projects/                 # Project screenshots
│   └── ...                       # Other images
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-toast.ts              # Toast notifications
│
├── styles/                       # Additional styles
│   └── globals.css
│
├── .kiro/                        # Project specifications
│   └── specs/
│       └── portfolio-refactor/
│
├── jest.config.js                # Jest configuration
├── jest.setup.js                 # Jest setup
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **pnpm**: Latest version

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/TeckTinkerere/myportfolio.git
cd myportfolio
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
pnpm dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production-ready application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:content-validation` | Run content validation tests |

---

## 📱 Portfolio Sections

### 1. Home (`/`)
- Professional introduction
- Technical summary with key metrics
- Skills snapshot
- Call-to-action buttons
- Social media links

### 2. Skills (`/skills`)
- Technical competencies organized by category
- Frontend, Backend, Database, Cloud & DevOps
- Proficiency levels
- Technology icons and descriptions

### 3. Featured Projects (`/projects`)
- Highlighted production applications
- Detailed project cards with:
  - Project name and description
  - Technology stack
  - Live demo and GitHub links
  - Technical highlights
- Organized by Personal and Academic projects

### 4. All Projects (`/all-projects`)
- Complete portfolio of 27 projects
- Advanced search and filter functionality
- Organized by status:
  - **Active & In Production** (8 projects)
  - **On Hold** (13 projects)
  - **MVPs** (2 projects)
  - **Conceptual** (2 projects)
  - **Completed** (3 projects)
- Category icons and status badges
- Statistics dashboard

### 5. Certifications (`/hall-of-fame`)
- Professional certifications
- Achievement badges
- Certification images
- Issuing organizations

### 6. Testimonials (`/visionary-wall`)
- Professional recommendations
- Client feedback
- Peer testimonials

### 7. Contact (`/contact`)
- Contact form with validation
- Email and social media links
- Professional inquiry handling

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TeckTinkerere/myportfolio)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## ⚡ Performance

### Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimizations

- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Minified CSS and JavaScript
- ✅ CDN delivery via Vercel
- ✅ Responsive images
- ✅ Efficient caching strategies

---

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... more variables */
}
```

### Adding Projects

Add new projects to `lib/all-projects.ts`:

```typescript
{
  id: 28,
  name: "Your Project",
  status: "Active",
  category: "Web App",
  keyTech: "Next.js, TypeScript",
  description: "Your project description",
  demoUrl: "https://demo.com",
  githubUrl: "https://github.com/..."
}
```

### Modifying Components

All components are in the `components/` directory and use TypeScript for type safety.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Mohamed Aslam Abdul Gafoor**

- 🌐 Portfolio: [https://myportfolio-aslam.vercel.app](https://myportfolio-aslam.vercel.app)
- 💼 LinkedIn: [mohamed-aslam-abdul](https://www.linkedin.com/in/mohamed-aslam-abdul)
- 🐙 GitHub: [@TeckTinkerere](https://github.com/TeckTinkerere)
- 📧 Email: aslam040607@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with 🫀 by Mohamed Aslam

</div>
