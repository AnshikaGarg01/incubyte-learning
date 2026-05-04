const noConsole = require('../rules/no-console');
const noTrailingWhitespace = require('../rules/no-trailing-whitespace');

const availableRules = {
    'no-console': noConsole,
    'no-trailing-whitespace': noTrailingWhitespace,
};

function lint(lines, config, externalRules = {}) {
    const allRules = { ...availableRules, ...externalRules };
    const activeRules = Object.entries(config.rules)
      .filter(([, severity]) => severity === 'warn' || severity === 'error')
      .map(([name, severity]) => ({ fn: allRules[name], severity }))
      .filter(({ fn }) => fn);

    return lines.flatMap((line, index) => {
      const lineNumber = index + 1;
      return activeRules
        .map(({ fn, severity }) => {
          const result = fn(line, lineNumber);
          return result ? { ...result, severity } : null;
        })
        .filter(Boolean);
    });
  }

module.exports = { lint };