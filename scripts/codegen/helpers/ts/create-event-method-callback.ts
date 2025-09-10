import ts, { factory } from 'typescript'

function createEventMethodCallback(methodName: string) {
  return factory.createArrowFunction(
    undefined,
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        factory.createToken(ts.SyntaxKind.DotDotDotToken),
        factory.createIdentifier('args'),
        undefined,
        undefined,
        undefined
      ),
    ],
    undefined,
    factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    factory.createCallExpression(
      factory.createNonNullExpression(
        factory.createPropertyAccessExpression(
          factory.createThis(),
          factory.createIdentifier(methodName)
        )
      ),
      undefined,
      [factory.createSpreadElement(factory.createIdentifier('args'))]
    )
  )
}

export default createEventMethodCallback
