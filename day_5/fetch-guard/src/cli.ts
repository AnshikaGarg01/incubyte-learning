#!/usr/bin/env node
import { Command } from 'commander';
import { scanFiles } from './scanner';
import { detectFile } from './detector';
import { formatJson, formatHuman } from './output';

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
  program.action(async (targetPath: string) => {
    const opts = program.opts();

    const files = await scanFiles(targetPath);
    const allFindings = (
      await Promise.all(files.map(f => detectFile(f)))
    ).flat();

    if (opts.json) {
      console.log(formatJson(allFindings, files.length));
    } else {
      console.log(formatHuman(allFindings));
      if (allFindings.length > 0) {
        console.log(`\n${allFindings.length} violation(s) found in ${files.length} file(s)`);
      }
    }

    process.exit(allFindings.length > 0 ? 1 : 0);
  });

  program.parse(process.argv);
}
