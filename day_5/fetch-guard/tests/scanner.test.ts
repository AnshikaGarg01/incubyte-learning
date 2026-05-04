// Given a path, return all .js and .ts files recursively — skipping node_modules and dist.

import * as path from 'path';
import * as fs from 'fs';
import { scanFiles } from '../src/scanner';

const fixturesDir = path.resolve(__dirname, 'fixtures/scanner');

beforeAll(() => {
  fs.mkdirSync(path.join(fixturesDir, 'nested'), { recursive: true });
  fs.writeFileSync(path.join(fixturesDir, 'a.ts'), '');
  fs.writeFileSync(path.join(fixturesDir, 'b.js'), '');
  fs.writeFileSync(path.join(fixturesDir, 'nested/c.ts'), '');
  fs.writeFileSync(path.join(fixturesDir, 'skip.css'), '');
});

describe('scanFiles', () => {
  it('finds all .ts and .js files in a directory', async () => {
    const files = await scanFiles(fixturesDir);
    expect(files.length).toBe(3);
  });

  it('ignores non JS/TS files', async () => {
    const files = await scanFiles(fixturesDir);
    expect(files.every(f => f.endsWith('.ts') || f.endsWith('.js'))).toBe(true);
  });

  it('finds files in nested directories', async () => {
    const files = await scanFiles(fixturesDir);
    expect(files.some(f => f.includes('nested'))).toBe(true);
  });

  it('accepts a single file path directly', async () => {
    const file = path.join(fixturesDir, 'a.ts');
    const files = await scanFiles(file);
    expect(files).toEqual([file]);
  });
});