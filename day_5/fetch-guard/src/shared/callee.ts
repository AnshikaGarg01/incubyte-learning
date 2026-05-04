import { TSESTree } from '@typescript-eslint/typescript-estree';

export function getCalleeName(
  callee: TSESTree.Expression | TSESTree.Super
): string | null {
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
    return `axios.${(callee.property as TSESTree.Identifier).name}`;
  }
  return null;
}
