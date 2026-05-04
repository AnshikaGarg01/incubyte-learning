import { Rule } from 'eslint';

function getCalleeName(callee: any): string | null {
  if (callee.type === 'Identifier') {
    if (callee.name === 'fetch' || callee.name === 'axios') {
      return callee.name;
    }
  }
  if (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'axios' &&
    callee.property.type === 'Identifier'
  ) {
    return `axios.${callee.property.name}`;
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    messages: {
      unhandledFetch:
        '`await {{ callee }}()` is not wrapped in try/catch — rejection will be unhandled',
    },
    schema: [],
  },
  create(context) {
    return {
      AwaitExpression(node) {
        const arg = (node as any).argument;
        if (!arg || arg.type !== 'CallExpression') return;

        const calleeName = getCalleeName(arg.callee);
        if (!calleeName) return;

        const ancestors = context.sourceCode.getAncestors(node);
        const isSafe = ancestors.some((a: any) => a.type === 'TryStatement');
        if (isSafe) return;

        context.report({
          node,
          messageId: 'unhandledFetch',
          data: { callee: calleeName },
        });
      },
    };
  },
};

export default rule;
