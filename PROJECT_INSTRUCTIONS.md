# edenavgi.dev — Master Project Instructions

## Identity & Context
- **Project name:** edenavgi.dev
- **Owner:** Eden Avgi
- **Type:** Personal portfolio website — showcasing web/SaaS and mobile app projects
- **Primary language:** English (Hebrew to be added later via i18n)
- **Repo:** https://github.com/EdenIvgi/edenavgi-dev
- **Local path:** C:\Users\edena\Desktop\edenavgi-dev
- **Deploy target:** Vercel (auto-deploy from GitHub main branch)

---

## Tech Stack — Full Specification

### Core
- **Framework:** Vite 5 + React 18 + TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (utility-first, dark mode via `class` strategy)
- **Routing:** React Router v6 (SPA, no SSR)
- **State:** React Context + useState/useReducer (no Redux — not needed)

### Animation Libraries
- **Framer Motion** — primary animation library for:
  - Page transitions (AnimatePresence)
  - Scroll-based reveal animations (whileInView)
  - Hero text animations (stagger, spring)
  - Layout animations (layout prop)
  - Hover/tap micro-interactions
- **GSAP + ScrollTrigger** — for complex scroll scenes:
  - Parallax effects
  - Pin sections
  - Timeline-based scroll storytelling
  - Only import where needed (code-split)
- **Three.js / React Three Fiber** — optional, Hero section only:
  - Decide after Hero design is finalized
  - Use only if it adds clear wow-factor without killing performance

### Internationalization
- **i18next + react-i18next**
- All user-facing strings go through `t('key')` from day one
- Translation files: `src/locales/en/translation.json` and `src/locales/he/translation.json`
- Language toggle in Navbar (EN / HE)
- RTL support for Hebrew: `dir="rtl"` on `<html>` when HE is active

### Contact Form
- **Resend** (preferred) or **EmailJS** — no backend needed
- Form validation: React Hook Form + Zod
- Success/error states with Framer Motion animations

### Dev Tooling
- ESLint + Prettier (strict config)
- Husky + lint-staged (pre-commit hooks)
- Absolute imports via `tsconfig.json` paths (`@/components/...`)
- `.env.local` for API keys (Resend, etc.)

---

## Project File Structure

```
edenavgi-dev/
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── videos/
│       └── .gitkeep
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   └── Tag.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageWrapper.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── Skills.tsx
│   │       ├── ProjectsGrid.tsx
│   │       └── Contact.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── NotFound.tsx
│   ├── data/
│   │   └── projects.ts
│   ├── hooks/
│   │   ├── useScrollAnimation.ts
│   │   └── useDarkMode.ts
│   ├── locales/
│   │   ├── en/translation.json
│   │   └── he/translation.json
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── project.ts
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Pages & Sections — Full Specification

### 1. Navbar
- Fixed top, backdrop-blur background on scroll
- Logo: "eden avgi" (left side)
- Nav links: About · Projects · Contact
- Right: Language toggle (EN/HE) + Dark/Light mode toggle
- Mobile: hamburger with Framer Motion slide-in drawer
- Scroll-hide: hide on scroll down, show on scroll up

### 2. Hero
- Full viewport height (`min-h-screen`)
- Pre-title fade-in, main title letter-stagger, subtitle typewriter
- CTA buttons: "View Projects" + "Get in Touch"
- Bouncing scroll indicator
- Background: gradient mesh / particles / Three.js (TBD)

### 3. About
- Two columns (text + visual) desktop, stacked mobile
- 2–3 short paragraphs + profile photo
- Slide-in scroll reveal
- Availability status badge

### 4. Skills
- Grid of tech badges by category (Frontend · Mobile · Backend · Tools)
- Hover lift + glow, stagger animation in viewport

### 5. Projects Grid
- Title with animated underline
- Filter bar: All · Web/SaaS · Mobile (Framer layout animation)
- 2 col desktop / 1 col mobile
- Card hover → autoplay muted video, lazy loaded
- Click → /projects/:id

### 6. Project Detail (/projects/:id)
- Back button, hero with title + video/screenshot
- Overview, demo video, screenshots gallery, tech stack, role, links
- Slide page transitions

### 7. Contact
- Name · Email · Message form
- React Hook Form + Zod validation
- Resend API submit (Vercel serverless) or EmailJS
- States: idle → loading → success → error
- Direct social links below

### 8. Footer
- Copyright + back-to-top

---

## Data Model

```typescript
interface Project {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  category: 'web' | 'mobile' | 'other'
  thumbnail: string
  videoSrc?: string
  videoSrcWebm?: string
  screenshots: string[]
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  year: number
}
```

---

## Animation System

### Global Rules
- AnimatePresence with `mode="wait"` for page transitions
- Standard reveal: opacity 0→1, y 30→0, duration 0.6, easeOut
- Stagger: 0.1
- Respect `prefers-reduced-motion`

### Standard Variants
```typescript
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}
```

### GSAP Rules
- Only for scroll-pinning + complex timelines
- Always kill ScrollTrigger in cleanup
- Import only what's needed

---

## Styling System
- Tailwind dark mode: `class`
- Custom colors: primary, surface, muted
- Headings: distinctive display font; Body: Inter / DM Sans / Geist
- Load via Fontsource or Google Fonts

---

## Performance
- Lighthouse 90+
- WebP images, lazy load below the fold
- Videos: webm + mp4, autoplay only on hover
- React.lazy for ProjectDetail
- aspect-ratio reservations to avoid CLS

---

## SEO
- Title: "Eden Avgi — Full Stack Developer"
- Meta description, OG tags, canonical URL, alt text everywhere

---

## Deployment
1. Push to `main`
2. Vercel auto-builds
3. Preview deploys on PRs
4. Env vars in Vercel dashboard
5. Custom domain edenavgi.dev → Vercel DNS

---

## Development Phases

### Phase 1 — Scaffold ✅ (completed 2026-04-26)
- [x] Vite 5 + React 18 + TS (strict)
- [x] Tailwind v4 via `@tailwindcss/vite` plugin + `@theme` in `globals.css`
- [x] React Router v6 with `AnimatePresence` page transitions and `React.lazy` for `ProjectDetail`
- [x] i18next initialized with EN + HE translations and RTL auto-toggle on `<html dir>`
- [x] Absolute imports via `@/*` (tsconfig.app.json + vite alias)
- [x] ESLint flat config + Prettier (+ `prettier-plugin-tailwindcss`)
- [x] Pages, sections, layout, ui, hooks, utils, types, data scaffolded with working placeholders
- [x] Dark mode via `class` strategy with `useDarkMode` hook + localStorage persistence
- [x] `npm install` + `npm run build` verified passing
- [ ] GitHub + Vercel (push + connect — pending user)

### Phase 2 — Hero
- [ ] Navbar (desktop)
- [ ] Hero with Framer animations
- [ ] Background effect
- [ ] Dark/Light toggle
- [ ] Mobile responsive

### Phase 3 — Projects
- [ ] projects.ts placeholder data
- [ ] ProjectsGrid + filter
- [ ] VideoCard with hover video
- [ ] ProjectDetail page

### Phase 4 — About + Skills + Contact
- [ ] About scroll animations
- [ ] Skills stagger grid
- [ ] Contact form + Resend
- [ ] Validation

### Phase 5 — Polish
- [ ] GSAP parallax
- [ ] Custom cursor (desktop)
- [ ] Page transitions
- [ ] Mobile drawer
- [ ] Lighthouse audit
- [ ] SEO meta

### Phase 6 — Launch
- [ ] Real data + videos
- [ ] Photo + about text
- [ ] Hebrew translations
- [ ] Custom domain
- [ ] Vercel Analytics
- [ ] OG image

---

## Code Standards

1. TypeScript strict — no `any`
2. One component per file, named exports
3. No inline styles — Tailwind only
4. Framer Motion before custom CSS animations
5. ARIA labels + keyboard nav on all interactive elements
6. Mobile first
7. i18n always — never hardcode user strings
8. JSDoc on exported components and hooks
9. Import order: React → third-party → internal (@/) → types → styles
10. Conventional commits: `feat:`, `fix:`, `style:`, `refactor:`
11. Env vars only via `import.meta.env.VITE_*`
12. Error boundaries around major sections
13. Ask before making design assumptions

---

## Implementation Log

Running record of what was actually built and any decisions that diverged from the original spec. Update this every time a phase ends.

### 2026-04-26 — Phase 1 scaffold

**Files created:**
- Configs: `package.json`, `vite.config.ts`, `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`, `eslint.config.js` (flat config — note: spec said `.eslintrc.json`, used flat config since ESLint 9 requires it), `.prettierrc`, `.gitignore`, `.env.local.example`, `index.html`
- Entry: `src/main.tsx`, `src/App.tsx`, `src/i18n.ts`, `src/vite-env.d.ts`, `src/styles/globals.css`
- Pages: `src/pages/Home.tsx`, `ProjectDetail.tsx`, `NotFound.tsx`
- Layout: `src/components/layout/Navbar.tsx`, `Footer.tsx`, `PageWrapper.tsx`
- UI: `src/components/ui/Button.tsx`, `Badge.tsx`, `Tag.tsx`, `VideoCard.tsx`
- Sections: `src/components/sections/Hero.tsx`, `About.tsx`, `Skills.tsx`, `ProjectsGrid.tsx`, `Contact.tsx`
- Hooks: `src/hooks/useDarkMode.ts`, `useScrollAnimation.ts` (also exports `fadeUp`, `staggerContainer`, `scaleIn` variants)
- Data/types/utils: `src/data/projects.ts` (placeholder data — pending real content), `src/types/project.ts`, `src/utils/cn.ts`
- i18n: `src/locales/en/translation.json`, `src/locales/he/translation.json`
- Public: `public/videos/.gitkeep`

**Decisions / deviations from spec:**
- **Tailwind v4 setup**: used `@tailwindcss/vite` plugin + inline `@theme` block in `globals.css` instead of a `tailwind.config.ts` file (this is the v4 idiomatic way; a JS config is no longer required).
- **ESLint config**: used `eslint.config.js` flat config instead of `.eslintrc.json` because ESLint 9 deprecated the legacy format.
- **`cn` utility**: implemented as a tiny zero-dep joiner. Spec mentioned `clsx + tailwind-merge` — those can be added later if class-conflict resolution becomes necessary.
- **Contact form**: Resend / EmailJS not yet wired — `onSubmit` is stubbed with a fake delay. Real integration deferred to Phase 4.
- **Form validation**: React Hook Form + Zod not yet installed — to be added in Phase 4 with Resend.
- **Three.js / GSAP / tsParticles**: not installed yet (deferred to later phases as spec allows).
- **Husky + lint-staged**: not yet set up (deferred — low priority for solo project pre-launch).
- **Project data**: `src/data/projects.ts` contains 2 placeholder projects. **Pending user input** — needs real project list, descriptions, tech stacks, links.
- **About / bio copy**: placeholder English text in `About.tsx`. **Pending user input** for real bio.

**Verified:**
- `npm install` — 211 packages, no errors.
- `npm run build` — passes (`tsc -b && vite build`), output ~356 KB JS / ~30 KB CSS, builds in ~2.3s.

### Pending user input (blocking Phase 6)
- ~~Real project catalog~~ ✅ done 2026-04-26
- ~~Personal bio copy~~ ✅ done 2026-04-26 (rewritten 2026-04-26 from CV summary)
- ~~Skills list aligned with CV~~ ✅ done 2026-04-26
- ~~Contact info (email, phone, LinkedIn, GitHub)~~ ✅ done 2026-04-26 (from CV)
- ~~Education + experience highlights in About~~ ✅ done 2026-04-26
- Profile photo (deferred per user — will add later)
- Project thumbnails / demo videos (deferred per user — currently all using `/og-image.jpg` placeholder)
- Final accent color / font choices (currently oklch blue + Cabinet Grotesk/Inter fallback)
- Decision on Hero background style (gradient mesh / particles / Three.js)

### 2026-04-26 — Project data loaded

**Source:** Read 6 GitHub repos via `gh`:
- `EdenIvgi/barApp-backend` + `EdenIvgi/barApp-frontend` → BarOS (bar management; React 18 + Vite + Redux + MUI + SCSS / Node + Express + MongoDB; live: baros.onrender.com)
- `LiorLazar/TaskRail-Frontend` (collab) + `EdenIvgi/taskrail-backend` → TaskRail (project/task management with WebSockets + JWT; live: taskrail-backend.onrender.com)
- `EdenIvgi/gethome-frontend` + `EdenIvgi/gethome-backend` → GetHome (apartment-listing aggregator with scrapers + Docker; live: gethome-frontend.vercel.app)

**Files updated:**
- `src/data/projects.ts` — 3 real Project entries with full descriptions, tech stacks, live URLs, GitHub URLs. BarOS + TaskRail marked `featured: true`.
- `src/components/sections/About.tsx` — bio copy rewritten to reference BarOS / TaskRail / GetHome and Eden's actual stack (React, Redux, Node, Express, MongoDB, WebSockets, JWT).

**Notes:**
- TaskRail frontend is co-authored with Lior Lazar — fullDescription explicitly credits the collaboration. Eden owns the backend.
- gethome repos have no README; description was inferred from repo metadata (description field, languages, Dockerfile, live URL).
- All thumbnails still point to placeholder `/og-image.jpg` — needs real screenshots before launch.

### 2026-04-26 — CV ingested

**Source:** `C:\Users\edena\Downloads\Group 1 (1).pdf` — Eden's official CV (Junior Fullstack Developer).

**Files updated:**
- `src/components/sections/About.tsx` — bio rewritten from CV Summary verbatim ("Junior Fullstack Developer with hands-on, end-to-end experience..."). Added Education + Experience cards (Coding Academy 2024–2025; Bar Manager 2019–2026; IDF Combat Commander 2016–2019).
- `src/components/sections/Skills.tsx` — categories restructured to match CV exactly: Frontend / Backend / AI / DevOps. Added Vue, Python, PostgreSQL, LLM Integration, RAG, Prompt Engineering, Vector Databases, Playwright.
- `src/components/sections/Contact.tsx` — added direct contact card grid with real email, phone, LinkedIn, GitHub from CV.
- `src/components/layout/Footer.tsx` — added GitHub / LinkedIn / Email social links.
- `src/locales/{en,he}/translation.json` — updated hero subtitle to "Fullstack Developer · End-to-end builder", added skills category keys, contact intro + direct-link labels.
- `src/data/projects.ts` — BarOS shortDescription/fullDescription rewritten using CV phrasing ("automates inventory workflows, reduces ordering errors, saves hours per week", "web & mobile"). TaskRail rewritten as "pixel-perfect Trello-like" with leadership framing from CV ("Led frontend... Independently developed the backend"). TaskRail year corrected 2026 → 2025 to match CV.

**Notes:**
- GetHome project kept in catalogue even though it's not on the CV — it's a real public repo and adds breadth.
- Phone number on site is the same `+972524222075` from the CV — flag if you want it hidden.
- "Junior" framing kept verbatim from CV; if you'd rather drop it on the site, easy one-line change in About.

### 2026-04-26 — Phone removed + Junior dropped (per user)

- `src/components/sections/Contact.tsx` — removed phone direct-link entry; only Email / LinkedIn / GitHub remain.
- `src/locales/{en,he}/translation.json` — removed `contact.directPhone` keys.
- `src/components/sections/About.tsx` — bio now reads "Fullstack Developer" (dropped "Junior" prefix).

### 2026-04-26 — Mobile capture pipeline + iPhone frame

**Goal:** capture BarOS in real mobile (iPhone 14 Pro) viewport and render every visual asset inside a CSS iPhone frame on the portfolio.

**New files:**
- `scripts/baros-mobile-flow-capture.mjs` — Playwright with `devices['iPhone 14 Pro']` (393×852 @ 3× DPR). Logs in (un-recorded), saves storage state, opens a fresh recording context, walks through products → add to cart → checkout → orders, and exports `flow-order.webm/mp4/gif`. Auto-loads `.env.local` if `BAROS_USER`/`BAROS_PASS` aren't in shell env. Includes a re-auth fallback on `/orders` because the BarOS app loses its in-memory auth state on direct URL navigation there — the script now first tries clicking the bottom-nav "Orders" tab, and if it still bounces to the sign-in form it re-fills credentials inline and retries.
- `src/components/ui/PhoneFrame.tsx` — pure-CSS iPhone shell (Dynamic-Island style notch, side buttons, 9:19.5 portrait aspect). Two sizes via `compact` prop (cards vs detail page).

**Modified:**
- `src/types/project.ts` — added `mobileFrame?: boolean` to `Project`.
- `src/components/ui/VideoCard.tsx` — when `mobileFrame` is set, the card renders the thumbnail (and hover GIF/video) inside a compact `PhoneFrame` on a soft gradient background.
- `src/pages/ProjectDetail.tsx` — when `mobileFrame` is set, the hero, flow GIF, demo video, and screenshot gallery all render inside `PhoneFrame`. Gallery becomes a 1/2/3-column grid of phones.
- `src/data/projects.ts` — BarOS now has `mobileFrame: true` and points to `/projects/baros/mobile/*` for thumbnail, GIF, MP4, WebM, and 6-shot gallery (Sign in → Menu → Cart → Checkout → Orders).
- `package.json` — new `capture:baros-mobile` script.
- `.env.local.example` — added `BAROS_USER` / `BAROS_PASS` placeholders.

**Run details:**
- Output: `public/projects/baros/mobile/` — 6 PNGs (`01-landing.png` through `06-orders-list.png`) + `flow-order.gif/.mp4/.webm` (~33s, 392×660).
- `07-order-detail.png` skipped — BarOS doesn't expose a clickable order-detail view from the orders list (the 6th screenshot already shows the created orders inline with date, customer, item count, and edit/delete actions).

**Notes:**
- BarOS top nav always shows a "Sign In" label even after auth — confusing in screenshots but harmless: the orders DID get created (toast "2 Orders Created – 2 Products" appears in `05-checkout-done.png`) and the orders list (`06-orders-list.png`) shows the user's avatar "EA" once the app's in-memory state is restored.
- Re-running the script overwrites all assets cleanly.

### 2026-04-26 — Mobile flow capture pipeline + iPhone frame

**Goal:** Re-capture BarOS as a mobile experience and present every screenshot / GIF inside an iPhone-shaped frame on the portfolio.

**New files:**
- `scripts/baros-mobile-flow-capture.mjs` — Playwright script that uses `devices['iPhone 14 Pro']` (393×852 @ DPR 3, mobile UA). Logs in once (mobile UA so cookies are issued for the same session), then records the order flow on a fresh context and saves seven step-by-step screenshots:
  - `01-landing.png` (sign-in screen, pre-login)
  - `02-products.png` (menu)
  - `03-product-added.png`
  - `04-cart.png`
  - `05-checkout-done.png`
  - `06-orders-list.png`
  - `07-order-detail.png`
  - `flow-order.webm/.mp4/.gif` (full flow recording, ffmpeg-converted)
  All artifacts land in `public/projects/baros/mobile/`.
- `src/components/ui/PhoneFrame.tsx` — pure-CSS iPhone frame (Dynamic-Island style, side buttons, 19.5/9 portrait aspect). Wraps any media. Has a `compact` prop for cards.

**Files updated:**
- `package.json` — added `capture:baros-mobile` script.
- `src/types/project.ts` — added optional `mobileFrame: boolean` to `Project`.
- `src/pages/ProjectDetail.tsx` — when `mobileFrame=true`, hero image, flow GIF, demo video, and gallery thumbnails all render inside `PhoneFrame`. Gallery becomes a 2/3-column grid of phones.
- `src/components/ui/VideoCard.tsx` — when `mobileFrame=true`, the project card renders a compact `PhoneFrame` over a soft gradient background instead of the standard 16:9 thumbnail block.
- `src/data/projects.ts` — BarOS now has `mobileFrame: true`, points at `/projects/baros/mobile/*`, and lists six gallery captions (Sign in / Menu / Cart / Checkout / Orders / Order detail). `videoSrc`/`videoSrcWebm` also wired up.

**Why Playwright instead of Claude in Chrome:** Chrome refuses to resize its window below ~500px wide, and the MCP screenshot tool captures the OS-level window — meaning we can't get a true mobile viewport via the extension. Playwright's `devices['iPhone 14 Pro']` emulates a real mobile context (UA, viewport, DPR, touch) and produces clean 393-wide assets that fit the iPhone CSS frame exactly.

**Build:** `npm run build` passes (433 modules; ~365 KB JS / ~34 KB CSS).

**To produce the assets, run:**
```
$env:BAROS_USER="..."; $env:BAROS_PASS="..."; npm run capture:baros-mobile
```
After it finishes, the eight files appear under `public/projects/baros/mobile/` and the site picks them up automatically.
