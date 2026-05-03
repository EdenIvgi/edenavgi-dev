import PageWrapper from '@/components/layout/PageWrapper'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import Contact from '@/components/sections/Contact'

/** Single-scroll landing page assembling every section. */
export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <About />
      <Skills />
      <ProjectsGrid />
      <Contact />
    </PageWrapper>
  )
}
