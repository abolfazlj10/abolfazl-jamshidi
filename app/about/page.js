import { ArrowLink } from '../portfolio';
import profile from '../../data/profile.json';

export const metadata = {
  title: 'About — Abolfazl Jamshidi',
  description: 'Full-stack developer with a front-end focus, based in Tehran. Experience at Avan Tech and Worldbuilderzzz spans product interfaces, backend APIs, and data modelling.',
};
export default function About() {
  return <main id="main-content" className="about-page">
    <h1 className="sr-only">About Abolfazl Jamshidi</h1>
    <div className="about-portrait"><div className="portrait-frame"><img src="/images/abolfazl.png" alt="Abolfazl Jamshidi" width="1024" height="1536" fetchPriority="high" /></div></div>
    <div className="about-content">
      <div className="about-intro">{profile.intro.map((paragraph) => <p key={paragraph} data-reveal>{paragraph}</p>)}</div>
      <div className="about-details">
        <section className="about-info" aria-labelledby="experience-title">
          <h2 id="experience-title" data-reveal>Experience</h2>
          <div className="experience-list">{profile.experience.map((experience) => <article className="experience-entry" key={experience.company} data-reveal>
            <div className="experience-heading"><h3>{experience.url ? <a className="underline-link" href={experience.url} target="_blank" rel="noopener noreferrer">{experience.company} ↗</a> : experience.company}</h3><p className="experience-period">{experience.period}</p></div>
            <p className="experience-role">{experience.role}{experience.employment && <> · {experience.employment}</>}</p>
            <ul className="experience-highlights">{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </article>)}</div>
        </section>
        <section className="about-info" aria-labelledby="skills-title">
          <h2 id="skills-title" data-reveal>Technical toolkit</h2>
          <dl className="skill-groups">{profile.skills.map((group) => <div className="skill-group" key={group.label} data-reveal><dt>{group.label}</dt><dd><ul>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul></dd></div>)}</dl>
        </section>
        <div className="about-credits">
          <section className="about-info" data-reveal><h2>What’s next</h2><p>{profile.availability}</p></section>
          <section className="about-info" data-reveal><h2>Credit</h2><p className="muted">Development<br />{profile.name} ©{new Date().getFullYear()}</p><p className="muted reference-credit">Visual reference: <a className="underline-link" href="https://matthieugivelet.com/" target="_blank" rel="noopener noreferrer">Matthieu Givelet ↗</a></p></section>
          <section className="about-info" data-reveal><h2>Social</h2><div className="about-social"><a className="underline-link muted" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a className="underline-link muted" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></section>
          <ArrowLink className="about-contact" href={`mailto:${profile.email}`}>Get in touch</ArrowLink>
        </div>
      </div>
    </div>
  </main>;
}
