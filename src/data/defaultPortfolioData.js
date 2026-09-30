// Default initial portfolio data
// Provides instant rendering, zero-CLS, and full crawlability for SEO on first paint
export const defaultProjects = [
  {
    id: "proj-1",
    title: "Weather App",
    description: "Real-time weather tracking application leveraging OpenWeather API with location-based forecasts and responsive UI.",
    deployedUrl: "https://ritik-weather-live.vercel.app",
    githubUrl: "https://github.com/ritiksuthar/weather-app",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
    featured: true,
    order: 1,
    createdAt: "2026-09-28T16:00:00.000Z"
  },
  {
    id: "proj-2",
    title: "Notes API",
    description: "Secure, high-performance RESTful API for notes management with JWT authentication, role access, and MongoDB.",
    deployedUrl: "https://notes-api-ritik.onrender.com",
    githubUrl: "https://github.com/ritiksuthar/notes-api",
    tags: ["Node.js", "Express", "MongoDB"],
    category: "Backend",
    featured: true,
    order: 2,
    createdAt: "2026-09-28T16:00:00.000Z"
  },
  {
    id: "proj-3",
    title: "Portfolio Generator",
    description: "Dynamic personal developer portfolio with administrative CMS to manage projects, skills, and contact inquiries.",
    deployedUrl: "https://portfolio-ritik-live.vercel.app",
    githubUrl: "https://github.com/ritiksuthar/portfolio-generator",
    tags: ["React", "Tailwind CSS", "MongoDB"],
    category: "Full Stack",
    featured: true,
    order: 3,
    createdAt: "2026-09-28T16:00:00.000Z"
  },
  {
    id: "proj-4",
    title: "E-Commerce Platform",
    description: "Full-featured shopping web app with JWT authentication, cart state management, product filtering, and order history.",
    deployedUrl: "https://ritik-store-demo.vercel.app",
    githubUrl: "https://github.com/ritiksuthar/mern-ecommerce",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    category: "Full Stack",
    featured: true,
    order: 4,
    createdAt: "2026-09-28T16:00:00.000Z"
  },
  {
    id: "proj-5",
    title: "Algorithm Visualizer",
    description: "Interactive visualizer for computer science algorithms: sorting routines, binary search trees, and graph traversals.",
    deployedUrl: "https://algo-visualizer-ritik.vercel.app",
    githubUrl: "https://github.com/ritiksuthar/algo-visualizer",
    tags: ["JavaScript", "HTML5", "CSS3"],
    category: "Frontend",
    featured: false,
    order: 5,
    createdAt: "2026-09-28T16:00:00.000Z"
  }
];

export const defaultSkills = [
  {
    id: "skill-1",
    name: "React",
    category: "Frontend",
    icon: "react",
    proficiency: 90,
    featured: true,
    order: 1
  },
  {
    id: "skill-2",
    name: "Node.js",
    category: "Backend",
    icon: "nodejs",
    proficiency: 88,
    featured: true,
    order: 2
  },
  {
    id: "skill-3",
    name: "MongoDB",
    category: "Database",
    icon: "mongodb",
    proficiency: 85,
    featured: true,
    order: 3
  },
  {
    id: "skill-4",
    name: "JavaScript",
    category: "Language",
    icon: "javascript",
    proficiency: 92,
    featured: true,
    order: 4
  },
  {
    id: "skill-5",
    name: "Tailwind CSS",
    category: "Frontend",
    icon: "tailwind",
    proficiency: 90,
    featured: true,
    order: 5
  },
  {
    id: "skill-6",
    name: "TypeScript",
    category: "Language",
    icon: "javascript",
    proficiency: 86,
    featured: true,
    order: 6
  },
  {
    id: "skill-7",
    name: "HTML",
    category: "Frontend",
    icon: "html",
    proficiency: 95,
    featured: true,
    order: 7
  },
  {
    id: "skill-8",
    name: "CSS",
    category: "Frontend",
    icon: "css",
    proficiency: 92,
    featured: true,
    order: 8
  },
  {
    id: "skill-9",
    name: "Git & GitHub",
    category: "Tools",
    icon: "github",
    proficiency: 88,
    featured: true,
    order: 9
  },
  {
    id: "skill-10",
    name: "Express.js",
    category: "Backend",
    icon: "express",
    proficiency: 87,
    featured: true,
    order: 10
  },
  {
    id: "skill-11",
    name: "Responsive UI",
    category: "Frontend",
    icon: "code",
    proficiency: 90,
    featured: false,
    order: 11
  },
  {
    id: "skill-12",
    name: "REST APIs",
    category: "Backend",
    icon: "server",
    proficiency: 90,
    featured: false,
    order: 12
  }
];
