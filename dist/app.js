const paths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-1-7.87A6 6 0 0 1 17.5 9a4.5 4.5 0 0 1 .5 9Z"/><path d="M12 3V1M4 5 2.5 3.5M20 5l1.5-1.5"/>',
  calculator: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1M15 11h1M8 15h1M15 15h1M8 19h1M15 19h1"/>',
  game: '<path d="M8 3v18M16 3v18M3 8h18M3 16h18M10.5 10.5l3 3m0-3-3 3"/><circle cx="20" cy="4" r="2"/>',
  check: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 9 1.5 1.5L12 8M14 9h3M8 15h9"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
  key: '<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3M8 7v2"/>',
  code: '<path d="m8 5-7 7 7 7m8-14 7 7-7 7M14 3l-4 18"/>',
  play: '<path d="m9 5 10 7-10 7Z"/>'
};
function icon(name) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.grid}</svg>`; }
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalize = value => value.normalize('NFKC').toLowerCase().replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u200c\u200d\s-]/g,'');
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const grid = document.querySelector('#project-grid');
const search = document.querySelector('#search');
let projects = [];
let selected = 'all';
function card(project) {
  const live = project.status === 'available';
  return `<article class="card ${project.featured ? 'featured' : ''}" aria-labelledby="title-${escape(project.id)}" style="--accent:${escape(project.color)};--tint:${escape(project.tint)}">
    <div class="card-body"><div class="card-top"><span class="app-icon">${icon(project.icon)}</span><span class="category">${escape(project.categoryLabel)}</span></div>
    <h3 id="title-${escape(project.id)}">${escape(project.title)}</h3><span class="english" dir="ltr">${escape(project.english)}</span>
    <p class="card-description">${escape(project.description)}</p><div class="tags">${project.tags.map(tag => `<span class="tag">${escape(tag)}</span>`).join('')}</div>
    <div class="card-links">${live ? `<a class="demo" href="${escape(project.demo)}" target="_blank" rel="noopener noreferrer" aria-label="اجرای ${escape(project.title)} در تب جدید">${icon('play')} اجرای پروژه</a>` : `<span class="unavailable">${escape(project.statusLabel)}</span>`}
    <a class="source" href="${escape(project.repo)}" target="_blank" rel="noopener noreferrer" aria-label="کد ${escape(project.title)} در گیت‌هاب، تب جدید">${icon('code')} کد پروژه</a></div></div>
    ${project.featured && project.image ? `<a class="feature-image" href="${escape(project.demo)}" target="_blank" rel="noopener noreferrer" aria-label="اجرای تولبو در تب جدید"><img src="${escape(project.image)}" alt="تصویر واقعی صفحهٔ اصلی تولبو از مخزن پروژه" width="1440" height="900" fetchpriority="high"></a>` : ''}
  </article>`;
}
function render() {
  const query = normalize(search.value.trim());
  const filtered = projects.filter(p => (selected === 'all' || p.category === selected) && normalize([p.title,p.english,p.description,...p.tags].join(' ')).includes(query));
  grid.innerHTML = filtered.map(card).join('');
  document.querySelector('#empty').hidden = filtered.length !== 0;
  document.querySelector('#count').textContent = `${filtered.length.toLocaleString('fa-IR')} پروژه`;
  document.querySelector('#result-status').textContent = `${filtered.length.toLocaleString('fa-IR')} پروژه نمایش داده می‌شود`;
}
search.addEventListener('input', render);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  selected = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  render();
}));
document.querySelector('#reset').addEventListener('click', () => {search.value = '';document.querySelector('[data-filter="all"]').click();search.focus();});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable && !event.metaKey && !event.ctrlKey && !event.altKey) {event.preventDefault();search.focus();}
});
try {
  const response = await fetch('./projects.json');
  if (!response.ok) throw new Error('Project catalog unavailable');
  projects = await response.json();
  render();
} catch {
  grid.innerHTML = '<p role="alert">فهرست پروژه‌ها بارگذاری نشد. صفحه را دوباره باز کنید یا <a class="text-link" href="https://github.com/abolfazlj10">پروژه‌ها را در گیت‌هاب ببینید.</a></p>';
}
