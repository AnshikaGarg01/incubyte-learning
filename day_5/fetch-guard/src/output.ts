import { Finding } from './detector';

export function formatJson(findings: Finding[], filesScanned: number): string {
  return JSON.stringify(
    {
      summary: {
        filesScanned,
        violationsFound: findings.length,
      },
      violations: findings,
    },
    null,
    2
  );
}

export function formatHuman(findings: Finding[]): string {
  if (findings.length === 0) {
    return '✓ no violations found';
  }

  const lines = findings.map(
    f => `${f.file}:${f.line}:${f.column} — ${f.message}`
  );

  return lines.join('\n');
}
