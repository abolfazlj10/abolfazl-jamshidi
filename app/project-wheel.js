'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpRight, BookOpenText, Calculator, CheckCheck, CloudSun, Code2, KeyRound, Toolbox, X } from 'lucide-react';
import { relativePosition, wheelPosition, wrapIndex } from './wheel-math.mjs';

const icons = { toolbox: Toolbox, weather: CloudSun, calculator: Calculator, game: X, tasks: CheckCheck, language: BookOpenText, password: KeyRound };

function subscribeToMotionPreference(callback) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getMotionPreference() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerMotionPreference() {
  return false;
}

function ProjectIcon({ project }) {
  const Icon = icons[project.icon] || Toolbox;
  return (
    <span className={`project-icon icon-${project.icon}`} style={{ '--accent': project.accent }}>
      <Icon aria-hidden="true" strokeWidth={1.5} />
      {project.icon === 'game' && <span className="game-circle" aria-hidden="true" />}
    </span>
  );
}

function WheelItem({ project, index, count, position, activeIndex, select }) {
  const location = useTransform(position, (value) => wheelPosition(index, value, count));
  const left = useTransform(location, (value) => value.left);
  const top = useTransform(location, (value) => value.top);
  const scale = useTransform(location, (value) => value.scale);
  const opacity = useTransform(location, (value) => value.opacity);
  const visibility = useTransform(location, (value) => value.visible ? 'visible' : 'hidden');
  const offset = relativePosition(index, activeIndex, count);
  const active = index === activeIndex;
  return (
    <motion.div className={`wheel-item${active ? ' is-active' : ''}`} style={{ left, top, opacity, visibility }}>
      <motion.button type="button" className="project-select" style={{ scale }} onClick={() => select(index)} aria-label={active ? `${project.title}, current project` : `Select ${project.title}`} aria-current={active ? 'true' : undefined} tabIndex={Math.abs(offset) <= 1 ? 0 : -1} title={project.title}>
        <ProjectIcon project={project} />
      </motion.button>
      <span className="wheel-caption" aria-hidden="true">
        <span>{active ? 'IN FOCUS' : offset < 0 ? 'PREVIOUS' : 'UP NEXT'}</span><span>{project.title}</span>
      </span>
    </motion.div>
  );
}

export default function ProjectWheel({ projects }) {
  const count = projects.length;
  const section = useRef(null);
  const target = useRef(0);
  const animation = useRef(null);
  const input = useRef({ total: 0, last: 0, consumed: false, direction: 0 });
  const touch = useRef(null);
  const suppressClickUntil = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const position = useMotionValue(0);
  const reduceMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, getServerMotionPreference);
  const active = projects[activeIndex];

  const go = useCallback((step) => {
    animation.current?.stop();
    target.current += step;
    setActiveIndex(wrapIndex(target.current, count));
    animation.current = animate(position, target.current, {
      duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        // Rebase complete turns so arbitrarily long browsing stays numerically stable.
        if (Math.abs(target.current) >= count * 20) {
          target.current = wrapIndex(target.current, count);
          position.set(target.current);
        }
      },
    });
  }, [count, position, reduceMotion]);

  const select = useCallback((index) => {
    const distance = relativePosition(index, target.current, count);
    if (distance) go(distance);
  }, [count, go]);

  useEffect(() => {
    const element = section.current;
    function wheel(event) {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const bounds = element.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (delta > 0 && bounds.top > 2 && bounds.top <= delta + 80) {
        event.preventDefault();
        window.scrollTo({ top: window.scrollY + bounds.top, behavior: 'instant' });
        input.current = { total: 0, last: performance.now(), consumed: true, direction: 1 };
        return;
      }
      // Land on the section before rotating; native scrolling remains available on the left.
      if (bounds.top > 80 || bounds.bottom < window.innerHeight * 0.75 || event.clientX < window.innerWidth * 0.32) return;
      event.preventDefault();
      if (Math.abs(bounds.top) > 2) {
        window.scrollTo({ top: window.scrollY + bounds.top, behavior: 'instant' });
        return;
      }
      const now = performance.now();
      const direction = Math.sign(event.deltaY);
      if (!direction) return;
      const gesture = input.current;
      if (now - gesture.last > 180 || gesture.direction !== direction) {
        gesture.total = 0;
        gesture.consumed = false;
      }
      gesture.last = now;
      gesture.direction = direction;
      if (gesture.consumed) return;
      gesture.total += delta;
      if (Math.abs(gesture.total) >= 42) { gesture.consumed = true; go(direction); }
    }
    window.addEventListener('wheel', wheel, { passive: false });
    return () => { window.removeEventListener('wheel', wheel); animation.current?.stop(); };
  }, [go]);

  function keyDown(event) {
    if (event.target.closest('a, button, input, textarea, select')) return;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(1); }
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); go(-1); }
    else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : count - 1); }
  }

  function touchStart(event) {
    const point = event.touches[0];
    touch.current = { x: point.clientX, y: point.clientY };
  }

  function touchEnd(event) {
    if (!touch.current) return;
    const point = event.changedTouches[0];
    const dx = touch.current.x - point.clientX;
    const dy = touch.current.y - point.clientY;
    touch.current = null;
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) {
      suppressClickUntil.current = performance.now() + 400;
      go(Math.sign(dy));
    }
  }

  return (
    <section id="projects" ref={section} className="projects-section" aria-labelledby="projects-title" aria-roledescription="carousel" tabIndex={0} onKeyDown={keyDown} style={{ '--project-accent': active.accent }}>
      <header className="projects-header">
        <div><p className="eyebrow">02 / SELECTED WORK</p><h2 id="projects-title">Made to be used<span>.</span></h2></div>
        <div className="projects-header-links"><a href="#intro">Intro <ArrowUp size={12} /></a><span className="project-total">{String(count).padStart(2, '0')} PROJECTS</span></div>
      </header>
      <div className="projects-body">
        <div className="project-story">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article className="project-detail" key={active.id} initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} aria-label={active.title}>
              <div className="project-overline"><span className="small-line" /><span>{active.category}</span><span className="project-number">{String(activeIndex + 1).padStart(2, '0')}</span></div>
              <h3>{active.title}<span>.</span></h3>
              <p className="project-description">{active.description}</p>
              <ul className="project-tags" aria-label="Project technologies">{active.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <div className="project-links">
                {active.status === 'available' ? <a className="primary-link" href={active.demo} target="_blank" rel="noopener noreferrer">Open project <ArrowUpRight size={18} /></a> : <span className="offline-label">Live demo offline</span>}
                <a className="source-link" href={active.repo} target="_blank" rel="noopener noreferrer"><Code2 size={16} /> Source code <ArrowUpRight size={14} /></a>
              </div>
              {active.image ? (
                <a className="project-preview" href={active.demo} target="_blank" rel="noopener noreferrer" aria-label={`Open ${active.title} in a new tab`}>
                  <div className="preview-bar"><span /><span /><span /><span className="preview-domain">{new URL(active.demo).hostname}</span><ArrowUpRight size={13} /></div>
                  <img src={active.image} alt={`${active.title} interface`} width={1280} height={800} loading="lazy" />
                </a>
              ) : <div className="source-preview"><KeyRound size={32} strokeWidth={1.3} /><span>CPass</span><a href={active.repo} target="_blank" rel="noopener noreferrer">Explore the repository <ArrowUpRight size={15} /></a></div>}
            </motion.article>
          </AnimatePresence>
        </div>
        <div className="wheel-stage" onTouchStart={touchStart} onTouchEnd={touchEnd} onTouchCancel={() => { touch.current = null; }} onClickCapture={(event) => {
          if (event.detail > 0 && performance.now() < suppressClickUntil.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}>
          <div className="wheel-orbit" aria-hidden="true" /><div className="wheel-focus-line" aria-hidden="true" />
          {projects.map((project, index) => <WheelItem key={project.id} project={project} index={index} count={count} position={position} activeIndex={activeIndex} select={select} />)}
        </div>
      </div>
      <div className="projects-bottom">
        <div className="project-index" role="group" aria-label="Choose a project">
          {projects.map((project, index) => <button type="button" key={project.id} className={index === activeIndex ? 'is-current' : ''} onClick={() => select(index)} aria-label={`Select ${project.title}`} aria-pressed={index === activeIndex} title={project.title}><span /></button>)}
        </div>
        <div className="wheel-controls">
          <span className="current-count" aria-live="polite" aria-atomic="true">{String(activeIndex + 1).padStart(2, '0')} <span>/ {String(count).padStart(2, '0')}</span><span className="sr-only">, {active.title}</span></span>
          <button type="button" className="arrow-control" onClick={() => go(-1)} aria-label="Previous project" title="Previous project"><ArrowUp size={18} /></button>
          <button type="button" className="arrow-control" onClick={() => go(1)} aria-label="Next project" title="Next project"><ArrowDown size={18} /></button>
        </div>
      </div>
    </section>
  );
}
