import { notFound } from 'next/navigation';
import { ArrowLink, ProjectVisual } from '../../portfolio';
import projects from '../../../data/projects.json';

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((project) => ({ slug: project.id })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  return { title: `${project?.title || 'Project'} — Abolfazl Jamshidi`, description: project?.description };
}
export default async function Project({ params }) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.id === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];
  return <main id="main-content" className="project-page">
    <div className="project-info">
      <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
      <div><h1 className="project-title">{project.title}</h1><div className="project-description">
        <p className="project-date">[ {project.year || String(index + 1).padStart(2, '0')} ]</p>
        <div className="project-details"><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><p>{project.description}</p>
          <div className="project-external-links"><ArrowLink href={project.demo} external>Visit website</ArrowLink>{project.repo && <ArrowLink href={project.repo} external>Source code</ArrowLink>}</div>
          {project.status === 'unavailable' && <p className="project-availability">Website was unavailable at the last check.</p>}
        </div>
      </div></div>
      <ArrowLink className="next-project-desktop" href={`/project/${nextProject.id}/`}>Next project</ArrowLink>
    </div>
    <div className="project-gallery">
      <ProjectVisual project={project} className="project-cover" priority />
      {project.image && <div className="project-browser-scene" style={{ '--project-color': project.accent }} data-reveal><div className="browser-mockup"><div className="browser-toolbar" aria-hidden="true"><span>● ● ●</span><span>{new URL(project.demo).hostname}</span><span>↗</span></div><img src={project.image} alt={`${project.title}, full website view`} width="1440" height="900" loading="lazy" /></div></div>}
      {project.image && <div className="project-device-scene" style={{ '--project-color': project.accent }} data-reveal><div className="detail-crop"><img src={project.image} alt={`${project.title}, design detail`} width="1440" height="900" loading="lazy" /></div><p>[ A closer look ]</p></div>}
      <ArrowLink className="next-project-mobile" href={`/project/${nextProject.id}/`}>Next project</ArrowLink>
    </div>
  </main>;
}
