import { Footer, InfoRow, ProjectGrid } from '../portfolio';
import projects from '../../data/projects.json';
import profile from '../../data/profile.json';

export const metadata = { title: 'Work — Abolfazl Jamshidi' };
export default function Work() {
  return <main id="main-content">
    <section className="work-hero page-gutter">
      <div className="work-title-wrapper"><h1 className="work-title"><span>Ideas</span><span className="idea-tile" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><path d="M38 64c-2-10-15-14-15-29a27 27 0 0 1 54 0c0 15-13 19-15 29M38 66h24M39 73h22M43 80h14M50 5V0M13 14l-7-7M87 14l7-7M9 37H0M91 37h9M16 61l-8 7M84 61l8 7M43 60V39l7 6 7-6v21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span>made real</span></h1></div>
      <InfoRow label="Work" text="A selection of websites, creative projects, and everyday tools. Different ideas, brought to life on the web." action={<span>{profile.workingSince ? `${profile.workingSince} – ${new Date().getFullYear()}` : `[ ${String(projects.length).padStart(2, '0')} projects ]`}</span>} />
    </section>
    <section className="all-work page-gutter" aria-label="All projects"><ProjectGrid projects={projects} /></section>
    <Footer />
  </main>;
}
