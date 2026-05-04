import { formatJson, formatHuman } from '../src/output';
import { Finding } from '../src/detector';

const findings: Finding[] = [
  {
    file: '/src/api.ts',
    line: 4,
    column: 5,
    callee: 'fetch',
    message: '`await fetch()` is not wrapped in try/catch',
  },
];

describe('formatJson', () => {
  it('emits valid JSON with summary and violations', () => {
    const output = formatJson(findings, 3);
    const parsed = JSON.parse(output);
    expect(parsed.summary.filesScanned).toBe(3);
    expect(parsed.summary.violationsFound).toBe(1);
    expect(parsed.violations[0].file).toBe('/src/api.ts');
  });

  it('emits empty violations array for a clean scan', () => {
    const output = formatJson([], 5);
    const parsed = JSON.parse(output);
    expect(parsed.summary.violationsFound).toBe(0);
    expect(parsed.violations).toEqual([]);
  });
});

describe('formatHuman', () => {
  it('formats each finding as file:line:column — message', () => {
    const output = formatHuman(findings);
    expect(output).toContain('/src/api.ts:4:5');
    expect(output).toContain('`await fetch()`');
  });

  it('returns a clean message when there are no violations', () => {
    const output = formatHuman([]);
    expect(output).toContain('no violations');
  });
});
