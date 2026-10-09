'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Code2, KeyRound } from 'lucide-react';
import { projectAtScroll, projectScrollOffset } from './project-scroll.mjs';

const pinnedQuery = '(min-width: 1000px) and (min-height: 720px)';
const number = (value) => String(value).padStart(2, '0');

export default function ProjectShowcase({ projects }) {
  const section = useRef(null);
  const panel = useRef(null);
  const progress = useRef(null);
  const touch = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];
  const count = projects.length;

  useEffect(() => {
    const media = window.matchMedia(pinnedQuery);
    section.current.dataset.scrollReady = 'true';
    let frame = 0;
    function update() {
      frame = 0;
      if (!media.matches) return;
      const bounds = section.current.getBoundingClientRect();
      const travel = section.current.offsetHeight - panel.current.offsetHeight;
      const offset = -bounds.top;
      setActiveIndex(projectAtScroll(offset, travel, count));
      if (progress.current) progress.current.style.transform = `scaleX(${Math.max(0, Math.min(1, travel > 0 ? offset / travel : 0))})`;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, [count]);

  const select = useCallback((index) => {
    const next = Math.max(0, Math.min(count - 1, index));
    setActiveIndex(next);
    if (window.matchMedia(pinnedQuery).matches) {
      const start = window.scrollY + section.current.getBoundingClientRect().top;
      const travel = section.current.offsetHeight - panel.current.offsetHeight;
      // The panel stays still. Only its place in the native scroll track changes.
      window.scrollTo({ top: start + projectScrollOffset(next, travel, count), behavior: 'instant' });
    }
  }, [count]);

  function keyDown(event) {
    if (event.target.closest('a, select, input, textarea')) return;
    let next;
    if (event.key === 'ArrowRight') next = activeIndex + 1;
    if (event.key === 'ArrowLeft') next = activeIndex - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = count - 1;
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  }

  function touchEnd(event) {
    if (!touch.current) return;
    const { clientX, clientY } = event.changedTouches[0];
    const dx = touch.current.x - clientX;
    const dy = touch.current.y - clientY;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) select(activeIndex + Math.sign(dx));
  }

  return (
    <section id="projects" ref={section} className="project-track" aria-labelledby="projects-title" style={{ '--project-count': count, '--project-accent': active.accent }}>
      <div className="projects-panel" ref={panel} onKeyDown={keyDown}>
        <div className="scroll-progress" aria-hidden="true"><span ref={progress} /></div>
        <header className="projects-header">
          <div><p className="eyebrow">01 / SELECTED WORK</p><h2 id="projects-title">Small ideas. Real projects<span>.</span></h2></div>
          <a href="#contact" className="quiet-link">Let&apos;s talk <ArrowUpRight size={16} /></a>
        </header>

        <div className="mobile-project-picker">
          <label htmlFor="project-picker">Choose a project</label>
          <select id="project-picker" value={activeIndex} onChange={(event) => select(Number(event.target.value))}>
            {projects.map((project, index) => <option key={project.id} value={index}>{number(index + 1)} / {project.title}</option>)}
          </select>
        </div>

        <article id="project-detail" className="project-content" aria-labelledby={`title-${active.id}`}>
          <div className="project-copy" key={`copy-${active.id}`}>
            <p className="project-overline"><span className="small-line" />{active.category}</p>
            <h3 id={`title-${active.id}`}>{active.title}<span>.</span></h3>
            <p className="project-description">{active.description}</p>
            <ul className="project-tags" aria-label="Project technologies">{active.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-links">
              {active.status === 'available' ? <a className="primary-link" href={active.demo} target="_blank" rel="noopener noreferrer">View live project <ArrowUpRight size={18} /></a> : <span className="offline-label">Demo currently offline</span>}
              <a className="source-link" href={active.repo} target="_blank" rel="noopener noreferrer"><Code2 size={16} /> Source code <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div className="project-visual" key={`visual-${active.id}`} onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={touchEnd} onTouchCancel={() => { touch.current = null; }}>
            {active.image ? <div className="preview-window">
              <div className="preview-bar"><div className="window-dots"><i /><i /><i /></div><span>{new URL(active.demo).hostname}</span><ArrowUpRight size={13} /></div>
              <img src={active.image} alt={`${active.title} interface preview`} width={1280} height={800} loading="eager" draggable="false" />
            </div> : <div className="source-preview"><KeyRound size={56} strokeWidth={1} /><span>CPass</span><p>A small tool for stronger passwords.</p><span className="source-preview-label">SOURCE AVAILABLE ON GITHUB</span></div>}
            <span className="preview-caption">{active.image ? 'A look inside the project' : 'Explore the code behind the project'}<span>{number(activeIndex + 1)} / {number(count)}</span></span>
          </div>
        </article>

        <div className="project-navigation">
          <div className="project-index" role="group" aria-label="Choose a project">
            {projects.map((project, index) => <button key={project.id} type="button" className={index === activeIndex ? 'is-current' : ''} aria-label={`Select ${project.title}`} aria-pressed={index === activeIndex} aria-controls="project-detail" onClick={() => select(index)}><span>{number(index + 1)}</span>{project.title}</button>)}
          </div>
          <div className="projects-bottom">
            <p className="scroll-hint"><ArrowDown size={14} /><span className="desktop-scroll-hint">Scroll to explore, or choose a project</span><span className="mobile-scroll-hint">A few things I&apos;ve built</span></p>
            <div className="project-controls">
              <span className="current-count">{number(activeIndex + 1)} <span>/ {number(count)}</span><span className="sr-only">, {active.title}</span></span>
              <button type="button" onClick={() => select(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous project"><ArrowLeft size={18} /></button>
              <button type="button" onClick={() => select(activeIndex + 1)} disabled={activeIndex === count - 1} aria-label="Next project"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-atomic="true">Project {activeIndex + 1} of {count}: {active.title}</p>
      <noscript><div className="project-fallback">{projects.map((project) => <a key={project.id} href={project.status === 'available' ? project.demo : project.repo}>{project.title} ↗</a>)}</div></noscript>
    </section>
  );
}
