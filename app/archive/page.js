import { Footer, InfoRow } from '../portfolio';
import { ArchiveList } from '../interactions';
import projects from '../../data/projects.json';

export const metadata = { title: 'Archive — Abolfazl Jamshidi' };
export default function Archive() {
  return <main id="main-content">
    <section className="archive-hero page-gutter">
      <div className="archive-title-wrapper"><h1>Selected<br />archive</h1></div>
      <InfoRow label="Archive" text="A closer look at the collection. Websites, creative experiences, and useful tools, all in one place." action={<span>[ {String(projects.length).padStart(2, '0')} projects ]</span>} />
    </section>
    <section className="archive-content page-gutter" aria-label="Project archive"><ArchiveList projects={projects} /></section>
    <Footer />
  </main>;
}
