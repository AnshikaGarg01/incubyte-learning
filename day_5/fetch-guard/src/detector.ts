import { parse } from '@typescript-eslint/typescript-estree';
import { TSESTree } from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import { getCalleeName } from './shared/callee';

export type Finding = {
    file: string;
    line: number;
    column: number;
    callee: string;
    message: string;
};

function walk(
    node: TSESTree.Node,
    ancestors: TSESTree.Node[],
    visitor: (node: TSESTree.AwaitExpression, ancestors: TSESTree.Node[]) => void
): void {
    if (node.type === 'AwaitExpression') {
        visitor(node, ancestors);
    }

    const nextAncestors = [...ancestors, node];

    for (const key of Object.keys(node)) {
        const child = (node as any)[key];
        if (Array.isArray(child)) {
            for (const item of child) {
                if (item && typeof item === 'object' && 'type' in item) {
                    walk(item as TSESTree.Node, nextAncestors, visitor);
                }
            }
        } else if (child && typeof child === 'object' && 'type' in child) {
            walk(child as TSESTree.Node, nextAncestors, visitor);
        }
    }
}

export function detect(source: string, filePath: string): Finding[] {
    const ast = parse(source, { loc: true });
    const findings: Finding[] = [];

    walk(ast, [], (awaitNode, ancestors) => {
        const arg = awaitNode.argument;
        if (!arg || arg.type !== 'CallExpression') return;

        const calleeName = getCalleeName(arg.callee);
        if (!calleeName) return;

        const isSafe = ancestors.some(a => a.type === 'TryStatement');
        if (isSafe) return;

        findings.push({
            file: filePath,
            line: awaitNode.loc!.start.line,
            column: awaitNode.loc!.start.column + 1,
            callee: calleeName,
            message: `\`await ${calleeName}()\` is not wrapped in try/catch — rejection will be unhandled`,
        });
    });

    return findings;
}

export async function detectFile(filePath: string): Promise<Finding[]> {
    const source = fs.readFileSync(filePath, 'utf8');
    return detect(source, filePath);
}