import { detect } from '../src/detector';

const FILE = 'test.ts';

describe('detect', () => {
  it('returns no findings for a file with no fetch calls', () => {
    const source = `const x = 1;`;
    expect(detect(source, FILE)).toEqual([]);
  });

  it('flags an unhandled await fetch()', () => {
    const source = `
      async function load() {
        const res = await fetch('/api/users');
      }
    `;
    const findings = detect(source, FILE);
    expect(findings.length).toBe(1);
    expect(findings[0].callee).toBe('fetch');
  });

  it('flags an unhandled await axios.get()', () => {
    const source = `
      async function load() {
        const res = await axios.get('/api/users');
      }
    `;
    const findings = detect(source, FILE);
    expect(findings.length).toBe(1);
    expect(findings[0].callee).toBe('axios.get');
  });

  it('does not flag await fetch() inside try/catch', () => {
    const source = `
      async function load() {
        try {
          const res = await fetch('/api/users');
        } catch (e) {}
      }
    `;
    expect(detect(source, FILE)).toEqual([]);
  });

  it('does not flag await axios inside try/catch', () => {
    const source = `
      async function load() {
        try {
          const res = await axios.get('/api/users');
        } catch (e) {}
      }
    `;
    expect(detect(source, FILE)).toEqual([]);
  });

  it('reports only unsafe calls in a mixed file', () => {
    const source = `
      async function safe() {
        try { await fetch('/safe'); } catch(e) {}
      }
      async function unsafe() {
        await fetch('/unsafe');
      }
    `;
    const findings = detect(source, FILE);
    expect(findings.length).toBe(1);
  });

  it('includes file, line, column, message in each finding', () => {
    const source = `
      async function load() {
        await fetch('/api');
      }
    `;
    const findings = detect(source, FILE);
    expect(findings[0]).toMatchObject({
      file: FILE,
      line: expect.any(Number),
      column: expect.any(Number),
      callee: 'fetch',
      message: expect.stringContaining('try/catch'),
    });
  });
});