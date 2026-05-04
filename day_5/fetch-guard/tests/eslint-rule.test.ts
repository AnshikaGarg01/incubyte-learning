import { RuleTester } from 'eslint';
import rule from '../src/eslint-rule';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('no-unhandled-fetch', rule, {
  valid: [
    {
      code: `
        async function load() {
          try {
            await fetch('/api/users');
          } catch(e) {}
        }
      `,
    },
    {
      code: `
        async function load() {
          try {
            await axios.get('/api/users');
          } catch(e) {}
        }
      `,
    },
  ],
  invalid: [
    {
      code: `async function load() { await fetch('/api'); }`,
      errors: [{ messageId: 'unhandledFetch' }],
    },
    {
      code: `async function load() { await axios.get('/api'); }`,
      errors: [{ messageId: 'unhandledFetch' }],
    },
    {
      code: `
        async function load() {
          try { await fetch('/safe'); } catch(e) {}
          await fetch('/unsafe');
        }
      `,
      errors: [{ messageId: 'unhandledFetch' }],
    },
  ],
});

describe('no-unhandled-fetch ESLint rule', () => {
  it('passes RuleTester without throwing', () => {
    expect(true).toBe(true);
  });
});
