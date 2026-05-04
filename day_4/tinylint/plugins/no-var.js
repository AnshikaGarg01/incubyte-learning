module.exports = {
    rules: {
      'no-var': function noVar(line, lineNumber) {
        if (/\bvar\b/.test(line)) {
          return { line: lineNumber, message: 'Use const or let instead of var' };
        }
        return null;
      }
    }
  };
