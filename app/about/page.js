import { ArrowLink } from '../portfolio';
import profile from '../../data/profile.json';

export const metadata = { title: 'About — Abolfazl Jamshidi' };
export default function About() {
  return <main id="main-content" className="about-page">
    <h1 className="sr-only">About Abolfazl Jamshidi</h1>
    <div className="about-portrait"><div className="portrait-frame"><img src="/images/abolfazl.png" alt="Abolfazl Jamshidi" width="1024" height="1536" fetchPriority="high" /></div></div>
    <div className="about-content">
      <div className="about-intro">{profile.intro.map((paragraph) => <p key={paragraph} data-reveal>{paragraph}</p>)}</div>
      <div className="about-details">
        <div className="about-services">
          <section className="about-info" data-reveal><h2>Creative websites</h2><p className="service-copy"><span>01</span>From personal portfolios to brand websites, I turn distinctive visual ideas into responsive, carefully crafted experiences.</p></section>
          <section className="about-info" data-reveal><h2>Development</h2><p className="service-copy"><span>02</span>I build with React, Next.js, and JavaScript, bringing designs to life with thoughtful motion, useful interactions, and attention to the details.</p></section>
        </div>
        <div className="about-credits">
          <section className="about-info" data-reveal><h2>{profile.location ? 'Based in' : 'Working with'}</h2><p className="muted">{profile.country || 'React · Next.js'}<br />[ {profile.location || 'The web'} ]</p></section>
          <section className="about-info" data-reveal><h2>Credit</h2><p className="muted">Development<br />{profile.name} ©{new Date().getFullYear()}</p><p className="muted reference-credit">Visual reference: <a className="underline-link" href="https://matthieugivelet.com/" target="_blank" rel="noopener noreferrer">Matthieu Givelet ↗</a></p></section>
          <section className="about-info" data-reveal><h2>Social</h2><p><a className="underline-link muted" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></p></section>
          <ArrowLink className="about-contact" href={`mailto:${profile.email}`}>Get in touch</ArrowLink>
        </div>
      </div>
    </div>
  </main>;
}
