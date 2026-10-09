import { ArrowDown, ArrowUpRight, Code2 } from 'lucide-react';
import projects from '../data/projects.json';
import ProjectShowcase from './project-showcase';

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#projects">Skip to projects</a>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#intro" aria-label="Abolfazl Jamshidi, introduction">aj<span>.</span></a>
        <div className="nav-links">
          <a href="#intro">Intro</a>
          <a href="#projects">Projects<span className="nav-count">{String(projects.length).padStart(2, '0')}</span></a>
          <a href="#contact">Let&apos;s talk <ArrowUpRight size={14} /></a>
        </div>
      </nav>
      <section id="intro" className="intro" aria-labelledby="intro-title">
        <div className="portrait-scene">
          <img className="portrait" src="/images/abolfazl-cutout.webp" alt="Portrait of Abolfazl Jamshidi" fetchPriority="high" width={1024} height={1536} />
        </div>
        <div className="intro-inner">
          <div className="intro-copy">
            <p className="eyebrow"><span className="small-line" /> WEB DEVELOPER</p>
            <h1 id="intro-title">Abolfazl<br />Jamshidi<span className="name-period">.</span></h1>
            <p className="intro-description">Websites with character. Built with care.<br /><span>I turn distinctive designs into websites<br className="desktop-break" /> that feel as good as they look.</span></p>
            <div className="intro-actions">
              <a className="primary-link" href="#projects">Explore my work <ArrowDown size={18} /></a>
              <a className="quiet-link" href="https://github.com/abolfazlj10" target="_blank" rel="noopener noreferrer" aria-label="Abolfazl on GitHub, opens in a new tab"><Code2 size={18} /> GitHub <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div className="intro-bottom">
            <span className="tiny-label">REACT / NEXT.JS / JAVASCRIPT</span>
            <a href="#projects" className="section-link"><span>SELECTED WORK</span><ArrowDown size={16} /></a>
          </div>
        </div>
      </section>
      <ProjectShowcase projects={projects} />
      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div><p className="eyebrow">02 / GET IN TOUCH</p><h2 id="contact-title">Have something<br />in mind<span>?</span></h2><p>For a project, an opportunity, or a conversation.</p></div>
        <div className="contact-links"><a className="contact-email" href="mailto:abolfazl.j.dev@gmail.com">Let&apos;s talk <ArrowUpRight size={32} /></a><a className="quiet-link" href="mailto:abolfazl.j.dev@gmail.com">abolfazl.j.dev@gmail.com</a><a className="quiet-link" href="https://github.com/abolfazlj10" target="_blank" rel="noopener noreferrer">Find me on GitHub <ArrowUpRight size={14} /></a></div>
      </section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Abolfazl Jamshidi</span><span>Made with care, down to the details.</span><a href="#intro">Back to top <ArrowUpRight size={14} /></a></footer>
    </main>
  );
}
