const { formatSummary, parseArgs } = require('../../lib/formatter');

describe('parseArgs', () => {
    it('returns the filename from argv', () => {
      const result = parseArgs(['node', 'tinylint', 'myfile.js']);
      expect(result).toEqual({ help: false, file: 'myfile.js' });
    });

    it('detects the --help flag', () => {
      const result = parseArgs(['node', 'tinylint', '--help']);
      expect(result).toEqual({ help: true, file: null });
    });

    it('returns null file when no argument is given', () => {
      const result = parseArgs(['node', 'tinylint']);
      expect(result).toEqual({ help: false, file: null });
    });
  });

describe('formatSummary', () => {
    it('reports zero violations for a clean run', () => {
        expect(formatSummary([])).toBe('✓ no violations found');
      });

      it('reports a single error correctly', () => {
        const violations = [{ severity: 'error', line: 1, message: 'x' }];
        expect(formatSummary(violations)).toBe('1 files checked, 1 errors, 0 warnings');
      });
  
      it('reports a single warning correctly', () => {
        const violations = [{ severity: 'warn', line: 1, message: 'x' }];
        expect(formatSummary(violations)).toBe('1 files checked, 0 errors, 1 warnings');
      });
  
      it('reports mixed errors and warnings', () => {
        const violations = [
          { severity: 'error', line: 1, message: 'x' },
          { severity: 'warn', line: 2, message: 'y' },
          { severity: 'warn', line: 3, message: 'z' },
        ];
        expect(formatSummary(violations)).toBe('3 files checked, 1 errors, 2 warnings');
      });
});