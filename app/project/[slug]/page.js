import { notFound } from 'next/navigation';
import { ArrowLink, Footer, ProjectVisual } from '../../portfolio';
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
  return <main id="main-content"><div className="project-page">
    <div className="project-info">
      <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
      <div><h1 className="project-title">{project.title}</h1><div className="project-description">
        <p className="project-date">{project.year ? `[ ${project.year} ]` : project.category}</p>
        <div className="project-details">
          {project.role && <div className="project-fact"><h2>My role</h2><p>{project.role}</p></div>}
          <div className="project-fact"><h2>{project.technologies ? 'Built with' : 'Project type'}</h2><ul>{(project.technologies || project.tags).map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
          <p>{project.description}</p>
          <div className="project-external-links"><ArrowLink href={project.demo} external>Visit website</ArrowLink>{project.repo && <ArrowLink href={project.repo} external>Source code</ArrowLink>}</div>
          {project.status === 'unavailable' && <p className="project-availability">Website was unavailable at the last check.</p>}
        </div>
      </div></div>
      <ArrowLink className="next-project-desktop" href={`/project/${nextProject.id}/`}>Next project</ArrowLink>
    </div>
    <div className="project-gallery">
      <ProjectVisual project={project} className="project-cover" priority />
      {project.caseStudy && <section className="project-story" aria-labelledby="story-title">
        <p className="story-label">Development notes</p>
        <h2 id="story-title">{project.caseStudy.title}</h2>
        <p className="story-intro">{project.caseStudy.intro}</p>
        {project.caseStudy.sections.map((section) => <div className="story-section" key={section.title}>
          <h3>{section.title}</h3><p>{section.text}</p>
        </div>)}
        <div className="story-explore"><h3>See it in action</h3><p>{project.caseStudy.explore}</p><ArrowLink href={project.demo} external>Explore the live website</ArrowLink></div>
      </section>}
      {project.gallery?.map((item) => <figure className="project-screenshot" key={item.src} data-reveal>
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
        <figcaption>{item.caption}</figcaption>
      </figure>)}
      <ArrowLink className="next-project-mobile" href={`/project/${nextProject.id}/`}>Next project</ArrowLink>
    </div>
    </div><Footer />
  </main>;
}
