import { ArrowLink, Footer, InfoRow, ProjectGrid } from './portfolio';
import { HeroName } from './interactions';
import projects from '../data/projects.json';
import profile from '../data/profile.json';

export default function Home() {
  return <main id="main-content">
    <section className="home-hero" aria-labelledby="intro-title">
      <HeroName projects={projects.filter((project) => project.image).slice(0, 4)} />
      <h1 id="intro-title" className="hero-subtitle">
        {profile.headline.map((line) => <span className="line-clip" key={line}><span>{line}</span></span>)}
        <span className="line-clip"><span>[ {profile.location || 'React / Next.js'} ]</span></span>
      </h1>
    </section>
    <div className="page-gutter"><InfoRow label="Approach" text={profile.approach} action={<ArrowLink href="/about/">More about me</ArrowLink>} /></div>
    <section id="projects" className="selected-work" aria-labelledby="selected-title">
      <div className="section-heading" data-reveal><h2 id="selected-title">Selected works</h2><ArrowLink className="desktop-only" href="/work/">See all works</ArrowLink></div>
      <ProjectGrid projects={projects.filter((project) => project.image).slice(0, 2)} />
      <ArrowLink className="mobile-all-work" href="/work/">See all works</ArrowLink>
    </section>
    <Footer />
  </main>;
}
