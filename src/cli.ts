import { Command } from 'commander';

  export function buildProgram(): Command {
    const program = new Command();

    program
      .name('fetch-guard')
      .description('Detect unhandled await fetch/axios calls')
      .version('1.0.0')
      .argument('<path>', 'file or directory to scan')
      .option('--json', 'output results as JSON', false);

    return program;
  }

  if (require.main === module) {
    const program = buildProgram();
    program.parse(process.argv);
  }