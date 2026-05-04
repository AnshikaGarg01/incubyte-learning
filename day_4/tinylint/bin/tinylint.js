#!/usr/bin/env node

const fs = require('fs');
const { lint } = require('../lib/linter');
const { loadConfig } = require('../lib/config');
const { loadPlugins } = require('../lib/plugin-loader');
const chalk = require('chalk');
const { formatSummary, parseArgs } = require('../lib/formatter');

const { help, file: targetFile } = parseArgs(process.argv);

if (help) {
  console.log(`
Usage: tinylint <file>

Options:
  --help    Show this help message

Rules are configured in .tinylintrc.json:
  {
    "plugins": ["./plugins/my-plugin"],
    "rules": {
      "no-console": "warn",
      "no-trailing-whitespace": "error"
    }
  }
`);
  process.exit(0);
}

if (!targetFile) {
    console.error(chalk.red("Usage: tinylint <file>"));
    process.exit(1);
  }

let contents;
try {
  contents = fs.readFileSync(targetFile, 'utf8');
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error(chalk.red(`Error: file not found — ${targetFile}`));
      } else {
        console.error(chalk.red(`Error reading file: ${err.message}`));
      }
      process.exit(1);
}

const lines = contents.split('\n');
const config = loadConfig();
const externalRules = loadPlugins(config.plugins);
const violations = lint(lines, config, externalRules);
if (violations.length === 0) {
    process.exit(0);
  }

  violations.forEach(({ line, message, severity }) => {
    const label = severity === 'error'
    ? chalk.red('ERROR')
    : chalk.yellow('WARN');
    console.log(`${chalk.bold(targetFile)}:${line} — ${label}: ${message}`);
  });
console.log(formatSummary(violations));

const hasErrors = violations.some(v => v.severity === 'error');
process.exit(hasErrors ? 1 : 0);