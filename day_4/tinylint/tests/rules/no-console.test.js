const noConsole = require('../../rules/no-console');

describe('no-console rule', () => {
  it('returns a violation when the line contains console.log', () => {
    const result = noConsole('console.log("hello")', 3);
    expect(result).toEqual({ line: 3, message: 'Unexpected console.log statement' });
  });

  it('returns null for a line without console.log', () => {
    const result = noConsole('const x = 1;', 1);
    expect(result).toBeNull();
  });

  it('returns null for an empty line', () => {
    const result = noConsole('', 1);
    expect(result).toBeNull();
  });

  it('flags console.log inside a larger expression', () => {
    const result = noConsole('if (x) console.log(x)', 5);
    expect(result).not.toBeNull();
  });
});
