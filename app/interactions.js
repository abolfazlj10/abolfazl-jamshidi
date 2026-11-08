'use client';

import { useEffect, useRef, useState } from 'react';
import Link from './navigation';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import profile from '../data/profile.json';

export function Header({ projectCount }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const links = [{ href: '/', label: 'Home' }, { href: '/work/', label: 'Work', count: projectCount }, { href: '/about/', label: 'About' }];
  const currentPath = pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`;
  const currentPage = (href) => currentPath === href ? 'page' : undefined;

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
    const desktop = window.matchMedia('(min-width: 901px)');
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
      <Link className="wordmark" href="/" aria-label={`${profile.name} — Home`} tabIndex={menuOpen ? -1 : undefined} onClick={() => setMenuOpen(false)}>
        <span className="brand-name">{profile.name}</span>
      </Link>
      <div className="desktop-links">{links.map((link) => <Link href={link.href} key={link.href} aria-current={currentPage(link.href)} className="nav-link"><span>{link.label}</span>{link.count !== undefined && <span className="nav-count">{link.count}</span>}</Link>)}</div>
      <a className="nav-contact" href={`mailto:${profile.email}`}><span>Get in touch</span><ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" /></a>
      <button ref={toggleRef} className="menu-toggle" aria-expanded={menuOpen} aria-controls={menuOpen ? 'mobile-menu' : undefined} onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? 'Close' : 'Menu'}</span>{menuOpen ? <X size={18} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.75} aria-hidden="true" />}</button>
    </nav>
    {menuOpen && <div className="mobile-menu" id="mobile-menu" ref={menuRef}>
      <p className="menu-eyebrow">Explore the portfolio</p>
      <nav aria-label="Mobile navigation">{links.map((link, index) => <Link key={link.href} href={link.href} aria-current={currentPage(link.href)} style={{ '--order': index }} onClick={() => setMenuOpen(false)}><span>{link.label}</span>{link.count !== undefined ? <span className="menu-count">{link.count}</span> : <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />}</Link>)}</nav>
      <div className="menu-footer"><p>Have something in mind?</p><a className="menu-contact" href={`mailto:${profile.email}`}><span>Get in touch</span><ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" /></a></div>
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
