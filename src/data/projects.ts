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
    title: 'GetHome\nApartment Aggregator',
    shortDescription:
      'Aggregates apartment listings from multiple sources into a single clean React frontend.',
    fullDescription:
      'GetHome is an apartment-search aggregator I built end to end. The backend is a Node.js service that runs scrapers against multiple listing sources, normalises the data into a single schema, and exposes it through a REST API.\nPackaged with Docker for repeatable deployment. The frontend is a React SPA that consumes the API and presents the listings in a fast, filterable interface, deployed on Vercel. The project tackles the messy, real-world problem of unifying inconsistent third-party data into a single coherent product.',
    category: 'web',
    showcase: {
      phoneScreen: '/projects/gethome/iphone-listings.png',
      tabletScreen: '/projects/gethome/ipad-hero.png',
    },
    thumbnail: '/projects/gethome/iphone-listings.png',
    logo: '/projects/logos/gethome.svg',
    screenshots: [],
    techStack: ['React', 'JavaScript', 'Node.js', 'Docker', 'Web Scraping', 'REST API', 'Vercel'],
    githubUrl: 'https://github.com/EdenIvgi/gethome-frontend',
    featured: false,
    year: 2026,
  },
]
