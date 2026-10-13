import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const projects = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url)));
const profile = JSON.parse(await readFile(new URL('../data/profile.json', import.meta.url)));

test('each project has a unique exportable route and valid destination', () => {
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  for (const project of projects) {
    assert.match(project.id, /^[a-z0-9-]+$/);
    assert.ok(project.title && project.description && project.tags.length);
    assert.equal(new URL(project.demo).protocol, 'https:');
    if (project.repo) assert.equal(new URL(project.repo).hostname, 'github.com');
    if (project.year) assert.match(String(project.year), /^\d{4}$/);
  }
});

test('all portfolio previews are local files that exist', async () => {
  for (const project of projects.filter((item) => item.image)) {
    assert.ok(project.image.startsWith('/projects/'));
    await access(new URL(`../public${project.image}`, import.meta.url));
  }
  await access(new URL('../public/images/abolfazl.png', import.meta.url));
});

test('profile uses the portfolio owner and preserves unknown personal details', () => {
  assert.equal(profile.name, 'Abolfazl Jamshidi');
  assert.equal(profile.email, 'abolfazl.j.dev@gmail.com');
  assert.equal(profile.headline.length, 2);
  for (const key of ['location', 'country', 'whatsapp', 'workingSince']) {
    assert.ok(profile[key] === null || typeof profile[key] === 'string' || typeof profile[key] === 'number');
  }
});
