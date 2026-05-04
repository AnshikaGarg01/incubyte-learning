const { lint } = require('../../lib/linter');

const errorConfig = {
  rules: { 'no-console': 'error', 'no-trailing-whitespace': 'error' },
};

const warnConfig = {
  rules: { 'no-console': 'warn', 'no-trailing-whitespace': 'warn' },
};

describe('lint', () => {
  it('returns no violations for a clean file', () => {
    const lines = ['const x = 1;', 'const y = 2;'];
    expect(lint(lines, errorConfig)).toEqual([]);
  });

  it('reports a console.log violation with correct line number', () => {
    const lines = ['const x = 1;', 'console.log(x)'];
    const violations = lint(lines, errorConfig);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ line: 2, severity: 'error' });
  });

  it('reports trailing whitespace violation', () => {
    const lines = ['const x = 1;   '];
    const violations = lint(lines, errorConfig);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ line: 1, message: 'Trailing whitespace' });
  });

  it('attaches severity from config to each violation', () => {
    const lines = ['console.log("hi")'];
    const violations = lint(lines, warnConfig);
    expect(violations[0].severity).toBe('warn');
  });

  it('skips rules not present in config', () => {
    const lines = ['console.log("hi")', 'const x = 1;   '];
    const config = { rules: { 'no-console': 'error' } };
    const violations = lint(lines, config);
    expect(violations).toHaveLength(1);
    expect(violations[0].message).toBe('Unexpected console.log statement');
  });

  it('returns multiple violations across multiple lines', () => {
    const lines = ['console.log("a")', 'console.log("b")'];
    const violations = lint(lines, errorConfig);
    expect(violations).toHaveLength(2);
  });

  it('runs rules from plugins', () => {
    const externalRules = {
      'no-var': function(line, lineNumber) {
        if (/\bvar\b/.test(line)) {
          return { line: lineNumber, message: 'Use const or let instead of var' };
        }
        return null;
      }
    };
    const config = { rules: { 'no-var': 'error' } };
    const lines = ['var x = 1;'];
    const violations = lint(lines, config, externalRules);
    expect(violations).toHaveLength(1);
    expect(violations[0].message).toBe('Use const or let instead of var');
  });
});
