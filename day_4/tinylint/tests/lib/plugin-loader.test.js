const path = require('path');
const { loadPlugins } = require('../../lib/plugin-loader');

const fixturePlugin = path.resolve(__dirname, '../fixtures/plugin-no-var');
describe('loadPlugins', () => {
    it('returns an empty object when no plugins are configured', () => {
      const rules = loadPlugins([]);
      expect(rules).toEqual({});
    });

    it('loads a plugin and returns its rules', () => {
      const rules = loadPlugins([fixturePlugin]);
      expect(typeof rules['no-var']).toBe('function');
    });

    it('merges rules from multiple plugins', () => {
      const rules = loadPlugins([fixturePlugin, fixturePlugin]);
      expect(rules).toHaveProperty('no-var');
    });

    it('throws a descriptive error when a plugin path cannot be found', () => {
      expect(() => loadPlugins(['./does-not-exist'])).toThrow('Cannot load plugin');
    });
});