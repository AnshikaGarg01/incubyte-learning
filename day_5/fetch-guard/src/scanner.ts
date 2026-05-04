import fg from 'fast-glob';
import * as fs from 'fs';

export async function scanFiles(target: string): Promise<string[]> {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    return [target];
  }

  return fg(['**/*.ts', '**/*.js'], {
    cwd: target,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  });
}

// fast-glob takes glob patterns (**/*.ts means "any .ts file, in any nested folder") and returns matching file paths. 
// The cwd option sets where to start searching, absolute: true returns full paths, and
// ignore skips folders we never want to lint.
// The stat.isFile() check handles the case where the user passes a single file directly — we skip globbing and return it as-is.