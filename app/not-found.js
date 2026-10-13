import { ArrowLink } from './portfolio';

export default function NotFound() {
  return <main id="main-content" className="not-found page-gutter">
    <p>[ 404 ]</p>
    <h1>This page has<br />moved on.</h1>
    <ArrowLink href="/work/">Explore the work</ArrowLink>
  </main>;
}
