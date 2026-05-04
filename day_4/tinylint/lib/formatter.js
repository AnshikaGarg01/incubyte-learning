function formatSummary(violations) {
    if (violations.length === 0) {
        return '✓ no violations found';
    }
    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warn').length;
    const filesChecked = violations.length;
    return `${filesChecked} files checked, ${errors} errors, ${warnings} warnings`;
}

function parseArgs(argv) {
    const args = argv.slice(2);
    if (args.includes('--help')) {
      return { help: true, file: null };
    }
    return { help: false, file: args[0] || null };
  }

  module.exports = { formatSummary, parseArgs };