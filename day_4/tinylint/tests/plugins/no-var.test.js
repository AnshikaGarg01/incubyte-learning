const plugin = require('../../plugins/no-var');

const noVar = plugin.rules['no-var'];

describe('no-var plugin rule', () => {
  it('returns a violation when the line uses var', () => {
    const result = noVar('var x = 1;', 1);
    expect(result).toEqual({ line: 1, message: 'Use const or let instead of var' });
  });

  it('returns null for const declarations', () => {
    expect(noVar('const x = 1;', 1)).toBeNull();
  });

  it('returns null for let declarations', () => {
    expect(noVar('let x = 1;', 1)).toBeNull();
  });

  it('returns null for an empty line', () => {
    expect(noVar('', 1)).toBeNull();
  });

  it('exports a rules object with the no-var key', () => {
    expect(plugin).toHaveProperty('rules');
    expect(typeof plugin.rules['no-var']).toBe('function');
  });
});
