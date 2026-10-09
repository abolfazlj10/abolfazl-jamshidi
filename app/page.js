import { ArrowDown, ArrowUpRight, Code2 } from 'lucide-react';
import projects from '../data/projects.json';
import ProjectWheel from './project-wheel';

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#intro" aria-label="Abolfazl Jamshidi, introduction">aj<span>.</span></a>
        <div className="nav-links">
          <a href="#intro">Intro</a>
          <a href="#projects">Projects<span className="nav-count">{String(projects.length).padStart(2, '0')}</span></a>
          <a href="mailto:abolfazl.j.dev@gmail.com">Let&apos;s talk <ArrowUpRight size={14} /></a>
        </div>
      </nav>
      <section id="intro" className="intro" aria-labelledby="intro-title">
        <div className="portrait-scene">
          <img className="portrait" src="/images/abolfazl-cutout.webp" alt="Portrait of Abolfazl Jamshidi" fetchPriority="high" />
        </div>
        <div className="intro-inner">
          <div className="intro-copy">
            <p className="eyebrow"><span className="small-line" /> WEB DEVELOPER</p>
            <h1 id="intro-title">Abolfazl<br /><span>Jamshidi</span><span className="name-period">.</span></h1>
            <p className="intro-description">I turn ideas into things you can use.<br />Thoughtful websites, useful tools, and a little<br className="desktop-break" /> room for experimentation.</p>
            <div className="intro-actions">
              <a className="primary-link" href="#projects">Explore my work <ArrowDown size={18} /></a>
              <a className="icon-link" href="https://github.com/abolfazlj10" target="_blank" rel="noopener noreferrer" aria-label="Abolfazl on GitHub, opens in a new tab" title="GitHub"><Code2 size={21} /></a>
            </div>
          </div>
          <div className="intro-bottom">
            <span className="tiny-label">IDEAS. CODE. SOMETHING REAL.</span>
            <a href="#projects" className="section-link"><span>01 / 02</span><ArrowDown size={16} /><span>SELECTED WORK</span></a>
          </div>
        </div>
      </section>
      <ProjectWheel projects={projects} />
      <footer className="site-footer">
        <a href="#intro">Abolfazl Jamshidi <ArrowUpRight size={14} /></a>
        <a href="mailto:abolfazl.j.dev@gmail.com">Have something in mind? Let&apos;s talk <ArrowUpRight size={14} /></a>
        <span>Built with curiosity.</span>
      </footer>
    </main>
  );
}
