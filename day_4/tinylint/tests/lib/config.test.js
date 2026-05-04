const path = require('path');
const { loadConfig } = require('../../lib/config');

const validFixture = path.resolve(__dirname, '../fixtures/valid.tinylintrc.json');
const invalidFixture = path.resolve(__dirname, '../fixtures/invalid.tinylintrc.json');
const missingFixture = path.resolve(__dirname, '../fixtures/does-not-exist.json');

describe('loadConfig', () => {
  it('loads and parses a valid config file', () => {
    const config = loadConfig(validFixture);
    expect(config.rules['no-console']).toBe('error');
    expect(config.rules['no-trailing-whitespace']).toBe('warn');
  });

  it('returns empty rules when config file does not exist', () => {
    const config = loadConfig(missingFixture);
    expect(config).toEqual({ rules: {} });
  });

  it('throws a descriptive error for invalid JSON', () => {
    expect(() => loadConfig(invalidFixture)).toThrow('Failed to parse .tinylintrc.json');
  });
});
