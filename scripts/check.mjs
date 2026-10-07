import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const root = new URL('../dist/',import.meta.url);
const projects = JSON.parse(await readFile(new URL('projects.json',root),'utf8'));
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Project IDs must be unique');
for (const p of projects) {
  assert.ok(p.title && p.description && p.tags.length && p.category);
  assert.equal(new URL(p.repo).host,'github.com');
  assert.equal(new URL(p.demo).protocol,'https:');
  assert.ok(['available','unavailable','unverified'].includes(p.status));
  if(p.image) await access(new URL(p.image,root));
}
for(const file of ['index.html','style.css','app.js','favicon.svg','assets/Vazirmatn-Regular.ttf','assets/Vazirmatn-Bold.ttf']) await access(new URL(file,root));
console.log(`Verified ${projects.length} project records, links and required local assets.`);
