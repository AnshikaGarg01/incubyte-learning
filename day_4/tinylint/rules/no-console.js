function noConsole(line, lineNumber) {
    if (line.includes('console.log')) {
      return { line: lineNumber, message: 'Unexpected console.log statement' };
    }
    return null;
};

module.exports = noConsole;