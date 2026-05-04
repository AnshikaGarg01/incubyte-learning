import { buildProgram } from '../src/cli';

describe('CLI argument parsing', () => {
  it('parses a target directory argument', () => {
    const program = buildProgram();
    program.parse(['node', 'fetch-guard', './src']);
    expect(program.args[0]).toBe('./src');
  });

  it('defaults --json to false', () => {
    const program = buildProgram();
    program.parse(['node', 'fetch-guard', './src']);
    expect(program.opts().json).toBe(false);
  });

  it('sets --json to true when flag is passed', () => {
    const program = buildProgram();
    program.parse(['node', 'fetch-guard', './src', '--json']);
    expect(program.opts().json).toBe(true);
  });
});