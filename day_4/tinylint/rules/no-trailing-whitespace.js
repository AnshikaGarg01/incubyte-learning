function noTrailingWhitespace(line, lineNumber) {
    if (/\s+$/.test(line)) {
        return { line: lineNumber, message: 'Trailing whitespace' };
      }
      return null;
};

module.exports = noTrailingWhitespace;