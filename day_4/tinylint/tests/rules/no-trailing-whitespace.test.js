const noTrailingWhitespace = require('../../rules/no-trailing-whitespace');

describe('no-trailing-whitespace rule', () => {
  it('returns a violation when the line has trailing spaces', () => {
    const result = noTrailingWhitespace('const x = 1;   ', 2);
    expect(result).toEqual({ line: 2, message: 'Trailing whitespace' });
  });

  it('returns a violation when the line has trailing tabs', () => {
    const result = noTrailingWhitespace('const x = 1;\t', 2);
    expect(result).not.toBeNull();
  });

  it('returns null for a clean line', () => {
    const result = noTrailingWhitespace('const x = 1;', 1);
    expect(result).toBeNull();
  });

  it('returns null for an empty line', () => {
    const result = noTrailingWhitespace('', 1);
    expect(result).toBeNull();
  });
});
