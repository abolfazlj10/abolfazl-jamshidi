import { ArrowLink, Footer, InfoRow, ProjectGrid } from './portfolio';
import { HeroName } from './interactions';
import projects from '../data/projects.json';
import profile from '../data/profile.json';

export default function Home() {
  const featuredProjects = profile.featuredProjects
    .map((id) => projects.find((project) => project.id === id))
    .filter((project) => project?.image);
  return <main id="main-content">
    <section className="home-hero" aria-labelledby="intro-title">
      <HeroName projects={featuredProjects} />
      <h1 id="intro-title" className="hero-subtitle">
        {profile.headline.map((line) => <span className="line-clip" key={line}><span>{line}</span></span>)}
        <span className="line-clip"><span>[ {[profile.location, profile.country].filter(Boolean).join(', ') || 'React / Next.js'} ]</span></span>
      </h1>
      <div className="hero-actions">
        <ArrowLink href="#projects">Explore my work</ArrowLink>
        <ArrowLink href={`mailto:${profile.email}`}>Get in touch</ArrowLink>
      </div>
      <p className="hero-availability">{profile.availability}</p>
    </section>
    <div className="page-gutter"><InfoRow label="Approach" text={profile.approach} action={<ArrowLink href="/about/">More about me</ArrowLink>} /></div>
    <section id="projects" className="selected-work" aria-labelledby="selected-title">
      <div className="section-heading" data-reveal><h2 id="selected-title">Selected works</h2><ArrowLink className="desktop-only" href="/work/">See all works</ArrowLink></div>
      <ProjectGrid projects={featuredProjects} />
      <ArrowLink className="mobile-all-work" href="/work/">See all works</ArrowLink>
    </section>
    <Footer />
  </main>;
}
