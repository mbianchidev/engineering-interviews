import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const projectRequire = createRequire(path.join(process.cwd(), 'package.json'));
const pluginRequire = createRequire(projectRequire.resolve('@next/eslint-plugin-next'));
const getRootDirs: (context: {
  cwd: string;
  settings: { next: { rootDir?: string | string[] } };
}) => string[] = pluginRequire('./utils/get-root-dirs.js').getRootDirs;

test('Next.js lint globs preserve directory matching without expanding literal roots', t => {
  const fixture = mkdtempSync(path.join(tmpdir(), 'next-eslint-globs-'));
  t.after(() => rmSync(fixture, { recursive: true }));
  mkdirSync(path.join(fixture, 'packages/site/pages'), { recursive: true });
  mkdirSync(path.join(fixture, 'packages/admin/pages'), { recursive: true });
  writeFileSync(path.join(fixture, 'packages/README.md'), 'Synthetic fixture\n');
  const site = path.join(fixture, 'packages/site');
  const admin = path.join(fixture, 'packages/admin');
  const roots = (rootDir?: string | string[]) => getRootDirs({
    cwd: fixture,
    settings: { next: { rootDir } },
  }).map(directory => directory.replaceAll('\\', '/')).sort();
  const expected = [admin, site].map(directory => directory.replaceAll('\\', '/')).sort();

  assert.deepEqual(roots(), [fixture.replaceAll('\\', '/')]);
  assert.deepEqual(roots(site), [site.replaceAll('\\', '/')]);
  assert.deepEqual(roots(path.join(fixture, 'packages/*')), expected);
  assert.deepEqual(roots(path.join(fixture, 'packages/{site,admin}')), expected);
  assert.deepEqual(roots([site, admin, path.join(fixture, 'packages/README.md')]), expected);
  assert.deepEqual(roots(site.replaceAll('/', '\\')), [site.replaceAll('\\', '/')]);
  assert.deepEqual(roots(path.join(fixture, 'missing-*')), []);
});
