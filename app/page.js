import projects from '../data/projects.json';

export default function Home() {
  return (
    <main>
      <header>
        <h1>پروژه‌ها</h1>
        <p>چند چیزی که ساخته‌ام.</p>
      </header>

      <ul aria-label="پروژه‌ها">
        {projects.map((project) => (
          <li key={project.id}>
            <div className="project-name">
              <h2>{project.title}</h2>
              <span lang="en" dir="ltr">{project.english}</span>
            </div>
            <div className="project-links">
              {project.status === 'available' ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`اجرای ${project.title} در تب جدید`}
                >
                  اجرا
                </a>
              ) : (
                <span className="unavailable">دمو ندارد</span>
              )}
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`گیت‌هاب ${project.title} در تب جدید`}
              >
                گیت‌هاب
              </a>
            </div>
          </li>
        ))}
      </ul>

      <footer>
        <a href="https://github.com/abolfazlj10" target="_blank" rel="noopener noreferrer">
          ابوالفضل جمشیدی<span className="sr-only">؛ گیت‌هاب، تب جدید</span>
        </a>
      </footer>
    </main>
  );
}
