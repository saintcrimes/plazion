import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { content, languages, formatPrice } from '../src/content.js';
import { projectAuthor } from '../src/project.js';

function shape(value, prefix = '') {
  if (Array.isArray(value)) return value.flatMap((item, index) => shape(item, `${prefix}[${index}]`));
  if (value && typeof value === 'object') return Object.keys(value).sort().flatMap(key => shape(value[key], `${prefix}.${key}`));
  return [`${prefix}:${typeof value}`];
}

test('every language translates the same complete content structure', () => {
  assert.deepEqual(languages.map(item => item.code), ['ru', 'en', 'uz']);
  for (const { code } of languages) {
    assert.deepEqual(shape(content[code]), shape(content.ru), `${code} has a missing translation`);
    const strings = JSON.stringify(content[code]);
    assert.ok(!strings.includes('undefined'));
    assert.ok(!strings.includes('TODO'));
    assert.equal(content[code].contact.author, projectAuthor.name);
  }
});

test('product identities and updated prices agree across languages', () => {
  for (const locale of Object.values(content)) {
    assert.deepEqual(locale.catalog.products.map(({ id, price }) => ({ id, price })), [
      { id: 'gl-jd-6a', price: 30000000 },
      { id: 'hybrid', price: 6000000 },
      { id: 'sensors', price: 10000000 },
    ]);
    assert.equal(locale.process.stages.length, 4);
    assert.equal(locale.specs.rows.length, 8);
    assert.equal(locale.contact.partnerNames.length, 3);
  }
});

test('author information uses the user-provided name and email', () => {
  assert.equal(projectAuthor.name, 'Behzod Ergashev');
  assert.equal(projectAuthor.email, 'behzodergasov5@gmail.com');
});

test('localised prices retain their original numeric values', () => {
  for (const { code } of languages) {
    assert.equal(formatPrice(39560000, code).replace(/\D/g, ''), '39560000');
    assert.equal(formatPrice(9500000, code).replace(/\D/g, ''), '9500000');
  }
});

test('Russian is the first-visit default and saved preferences are guarded', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<html lang="ru"/);
  assert.match(html, /try\s*\{/);
  assert.match(html, /catch\s*\{/);
  assert.match(html, /plazion-theme/);
  assert.match(html, /plazion-language/);
});
