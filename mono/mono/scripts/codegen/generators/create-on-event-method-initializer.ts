import ts, { factory } from 'typescript'

import createRemoveTask from './create-remove-task'

function createOnEventMethodInitializer({
  eventName,
  methodName,
}: createOnEventMethodInitializer.Options) {
  return factory.createIfStatement(
    factory.createBinaryExpression(
      factory.createStringLiteral(methodName),
      factory.createToken(ts.SyntaxKind.InKeyword),
      factory.createThis()
    ),
    factory.createBlock(
      [
        createRemoveTask(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createThis(),
                  factory.createIdentifier('Instance')
                ),
                factory.createIdentifier(eventName)
              ),
              factory.createIdentifier('Connect')
            ),
            undefined,
            [createEventMethodCallback(methodName)]
          )
        ),
      ],
      true
    ),
    undefined
  )
}

namespace createOnEventMethodInitializer {
  export interface Options {
    eventName: string
    methodName: string
  }
}

export default createOnEventMethodInitializer

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
