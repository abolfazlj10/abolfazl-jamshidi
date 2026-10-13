import Link from 'next/link';
import profile from '../data/profile.json';

export function ArrowLink({ href, children, className = '', external = false }) {
  const content = <><span className="link-arrow" aria-hidden="true">{external ? '↗' : '→'}</span><span className="link-label">{children}</span></>;
  return external || href.startsWith('mailto:')
    ? <a className={`arrow-link ${className}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{content}</a>
    : <Link className={`arrow-link ${className}`} href={href}>{content}</Link>;
}

export function InfoRow({ label, text, action }) {
  return <div className="info-row" data-reveal><p>[ {label} ]</p><div className="info-right"><p className="numbered-copy"><span className="copy-number" aria-hidden="true">01</span>{text}</p>{action && <div className="info-action">{action}</div>}</div></div>;
}

export function ProjectVisual({ project, className = '', priority = false }) {
  return <div className={`project-visual ${className}`} style={{ '--project-color': project.accent }}>
    {project.image ? <img src={project.image} alt={`${project.title} website preview`} width="1440" height="900" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
      : <div className="project-placeholder"><span>{project.title}</span><small>{new URL(project.demo).hostname}</small></div>}
  </div>;
}

export function ProjectGrid({ projects }) {
  return <div className="project-grid">{projects.map((project, index) => <Link className="project-card" href={`/project/${project.id}/`} key={project.id} data-reveal>
    <ProjectVisual project={project} />
    <div className="project-caption"><span className="project-index">{String(index + 1).padStart(2, '0')}</span><h3>{project.title}</h3><span className="card-arrow" aria-hidden="true">→</span></div>
  </Link>)}</div>;
}

export function Footer() {
  return <footer id="contact" className="site-footer" data-reveal><p>©{new Date().getFullYear()}</p><div className="footer-right">
    <div className="footer-column"><p>[ Open ]</p><p className="footer-message">{profile.contact} <a className="underline-link" href={`mailto:${profile.email}`}>say hello.</a></p></div>
    <div className="footer-column footer-contact"><p>[ Contact ]</p><div>Email : <a className="underline-link" href={`mailto:${profile.email}`}>{profile.email}</a><br />{profile.whatsapp ? <>Whatsapp : <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}>{profile.whatsapp}</a></> : <a className="underline-link" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}</div></div>
  </div></footer>;
}
