import type { Project } from '@/types/project'

/**
 * Project catalogue. Sourced from Eden's public GitHub repositories.
 * Replace `thumbnail` paths with real screenshots once added to /public.
 */
export const projects: Project[] = [
  {
    id: 'baros',
    title: 'BarOS\nBar Management Platform',
    shortDescription:
      'Web & mobile app that automates inventory workflows, reduces ordering errors, and saves hours per week.\nBuilt from real bar-management experience.',
    fullDescription:
      'BarOS is a web & mobile application I built from scratch, drawing on years of hands-on bar management. It automates inventory workflows, reduces ordering errors, and saves hours of manual work per week. I implemented comprehensive CRUD for inventory, products, and recipes, designed the REST API architecture, and integrated MongoDB for data persistence. The frontend is a React 18 + Vite SPA using Redux for state, Material-UI for the design system, React Router v6, Axios for HTTP, Formik + Yup for form validation, and Chart.js for daily reports. The backend is a Node.js + Express API structured into feature modules (item, category, order, user, auth)\neach with its own routes, controller, service, and model, so responsibilities stay clean as the surface area grows.',
    category: 'web',
    showcase: {
      phoneScreen: '/projects/baros/iphone-home.png',
      phoneScreen2: '/projects/baros/iphone-orders.png',
      tabletScreen: '/projects/baros/ipad-items.png',
    },
    thumbnail: '/projects/baros/iphone-home.png',
    logo: '/projects/logos/baros.svg',
    screenshots: [],
    screenshotGallery: [],
    techStack: [
      'React 18',
      'Vite',
      'Redux',
      'Material-UI',
      'React Router v6',
      'Axios',
      'Formik',
      'Yup',
      'Chart.js',
      'SCSS',
      'Node.js',
      'Express',
      'MongoDB',
    ],
    liveUrl: 'https://baros.onrender.com',
    githubUrl: 'https://github.com/EdenIvgi/barApp-frontend',
    featured: true,
    year: 2026,
  },
  {
    id: 'gethome',
    title: 'GetHome\nReal-Time Rental Listings',
    shortDescription:
      'An end-to-end platform that aggregates apartment listings from Yad2 and Facebook groups into a single real-time feed.\nBuilt to solve the fragmented rental search in Tel Aviv.',
    fullDescription:
      'GetHome is a fullstack platform I built end to end to solve a personal pain point: hunting for apartments in Tel Aviv across dozens of disconnected sources. It pulls listings from Yad2 and multiple Facebook groups, unifies them into a single schema, and pushes new matches to users in real time.\nThe backend is a Node.js + Express service running multi-source scrapers built on Playwright with stealth plugins to bypass anti-bot detection. A continuous ingestion pipeline normalises, deduplicates, and geocodes listings before persisting them to SQLite (better-sqlite3) — all orchestrated by background listeners scheduled with node-cron. Unstructured Facebook posts are parsed by the Groq LLM API, which extracts structured fields (price, rooms, neighborhood, amenities) from free-text content.\nReal-time delivery is implemented over Server-Sent Events (SSE): when a new listing matches a user\'s saved preferences, it\'s pushed to the browser instantly as a toast, with optional push notifications. The REST API also handles JWT-based authentication, filtering, and aggregated map data.\nThe frontend is a React 19 + Vite SPA styled with Tailwind and shadcn/ui (Radix Primitives), featuring an interactive Leaflet map, advanced filters (neighborhood, price, rooms, floor, sqm, pets, parking, balcony, elevator, furniture), a live ticker of incoming listings, saved searches, and full RTL Hebrew support. I owned the architecture, product decisions, and deployment lifecycle from day one.',
    category: 'web',
    showcase: {
      phoneScreen: '/projects/gethome/iphone-listings.png',
      tabletScreen: '/projects/gethome/ipad-hero.png',
    },
    thumbnail: '/projects/gethome/iphone-listings.png',
    logo: '/projects/logos/gethome.svg',
    screenshots: [],
    techStack: [
      'React 19',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'Radix Primitives',
      'React Leaflet',
      'Server-Sent Events',
      'Sonner',
      'Node.js',
      'Express 5',
      'SQLite (better-sqlite3)',
      'Playwright',
      'Playwright Stealth',
      'Groq LLM',
      'node-cron',
      'JWT',
      'bcrypt',
      'Axios',
      'Docker',
      'REST API',
    ],
    githubUrl: 'https://github.com/EdenIvgi/gethome-frontend',
    featured: false,
    year: 2026,
  },
]
