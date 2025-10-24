import ts, { factory } from 'typescript'

export default function createExtends(
  type: ts.ExpressionWithTypeArguments | undefined
) {
  return type
    ? [factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [type])]
    : []
}
