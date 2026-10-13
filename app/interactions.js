'use client';

import { useEffect, useRef, useState } from 'react';
import Link from './navigation';
import { usePathname } from 'next/navigation';
import profile from '../data/profile.json';

export function Entrance() {
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let active = true;
    let completed = 0;
    let finishTimer;
    let exitTimer;
    let finished = false;
    const started = performance.now();
    const images = [...document.images].filter((image) => image.loading !== 'lazy');
    const total = images.length + 1;
    const root = document.documentElement;
    root.classList.add('booting');
    setLoading({ progress: 0, exiting: false });
    function finish() {
      if (!active || finished) return;
      finished = true;
      clearTimeout(timeout);
      setLoading({ progress: 100, exiting: false });
      finishTimer = setTimeout(() => {
        if (!active) return;
        setLoading({ progress: 100, exiting: true });
        root.classList.remove('booting');
        exitTimer = setTimeout(() => { if (active) setLoading(null); }, 700);
      }, Math.max(0, 350 - (performance.now() - started)));
    }
    function advance() {
      if (!active || finished) return;
      completed += 1;
      setLoading({ progress: Math.round(completed / total * 100), exiting: false });
      if (completed === total) finish();
    }
    // A failed image or slow font must never prevent access to the portfolio.
    const timeout = setTimeout(finish, 2000);
    for (const image of images) image.decode().catch(() => {}).then(advance);
    (document.fonts?.ready || Promise.resolve()).then(advance, advance);
    return () => {
      active = false;
      clearTimeout(timeout);
      clearTimeout(finishTimer);
      clearTimeout(exitTimer);
      root.classList.remove('booting');
    };
  }, []);
  if (!loading) return null;
  return <div className={`entrance${loading.exiting ? ' entrance-exit' : ''}`} aria-hidden="true"><span>{loading.progress}%</span></div>;
}

export function Header({ projectCount, archiveCount }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const links = [{ href: '/', label: 'Home' }, { href: '/work/', label: 'Work', count: projectCount }, { href: '/archive/', label: 'Archive', count: archiveCount }, { href: '/about/', label: 'About' }];

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const content = document.querySelector('#page-content');
    if (content) content.inert = true;
    menuRef.current?.querySelector('a')?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
      if (event.key !== 'Tab') return;
      const focusable = [toggleRef.current, ...menuRef.current.querySelectorAll('a')].filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    const desktop = window.matchMedia('(min-width: 769px)');
    function closeOnDesktop(event) { if (event.matches) setMenuOpen(false); }
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (content) content.inert = false;
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return <header className={`site-header${menuOpen ? ' menu-is-open' : ''}`}>
    <nav className="navbar" aria-label="Main navigation">
      <Link className="wordmark" href="/" onClick={() => setMenuOpen(false)}>©AbolfazlJamshidi</Link>
      <div className="desktop-links">{links.slice(1).map((link) => <Link href={link.href} key={link.href} aria-current={pathname === link.href || `${pathname}/` === link.href ? 'page' : undefined} className="nav-link"><span>{link.label}</span>{link.count !== undefined && <sup>({link.count})</sup>}</Link>)}</div>
      <a className="nav-contact" href={`mailto:${profile.email}`}>Get in touch</a>
      <button ref={toggleRef} className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Close' : 'Menu'}</button>
    </nav>
    {menuOpen && <div className="mobile-menu" id="mobile-menu" ref={menuRef}>
      <p>[ Navigation ]</p>
      <nav aria-label="Mobile navigation">{links.map((link, index) => <Link key={link.href} href={link.href} style={{ '--order': index }} onClick={() => setMenuOpen(false)}>{link.label}{link.count !== undefined && <sup>({link.count})</sup>}</Link>)}</nav>
      <a className="menu-contact" href={`mailto:${profile.email}`}>→ Get in touch</a>
    </div>}
  </header>;
}

export function PageMotion({ children }) {
  const pathname = usePathname();
  const container = useRef(null);
  useEffect(() => {
    const elements = container.current?.querySelectorAll('[data-reveal]') || [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }, { threshold: 0.06 });
    for (const element of elements) {
      if (element.getBoundingClientRect().top >= window.innerHeight) { element.classList.add('reveal-ready'); observer.observe(element); }
    }
    return () => { observer.disconnect(); elements.forEach((element) => element.classList.remove('reveal-ready', 'is-visible')); };
  }, [pathname]);
  return <div id="page-content" ref={container}><div key={pathname} className="page-enter">{children}</div></div>;
}

export function HeroName({ projects }) {
  const [paused, setPaused] = useState(false);
  return <div className={`hero-name${paused ? ' hero-paused' : ''}`}>
    <span className="hero-word hero-word-first" aria-hidden="true">{[..."Abol"].map((letter, index) => <span className="hero-letter" style={{ "--letter": index }} key={index}>{letter}</span>)}</span>
    <button className="hero-reel" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play project slideshow' : 'Pause project slideshow'} aria-pressed={paused}>
      {projects.map((project, index) => <img key={project.id} src={project.image} alt="" width="360" height="260" style={{ '--frame': index }} fetchPriority={index === 0 ? 'high' : 'auto'} />)}
    </button>
    <span className="hero-word hero-word-last" aria-hidden="true">{[..."fazl"].map((letter, index) => <span className="hero-letter" style={{ "--letter": index + 4 }} key={index}>{letter}</span>)}</span>
    <span className="sr-only">Abolfazl Jamshidi</span>
  </div>;
}

export function ArchiveList({ projects }) {
  return <div className="archive-list">
    <div className="archive-columns archive-list-header" aria-hidden="true"><span>[ Name ]</span><span>[ Detail ]</span><span>[ Date ]</span></div>
    {projects.map((project) => <Link className="archive-row" key={project.id} href={`/project/${project.id}/`} data-reveal aria-label={`${project.title}, ${project.tags[0]}`}>
      <div className="archive-columns"><span>{project.title}</span><span>{project.tags[0]}</span><span>{project.year || '—'}</span></div>
      <div className="archive-preview" style={{ background: project.accent }}>{project.image ? <img src={project.image} alt={`${project.title} preview`} width="600" height="600" loading="lazy" /> : <span>{project.title}</span>}</div>
      <span className="archive-mobile-label">{project.title}</span>
    </Link>)}
  </div>;
}
