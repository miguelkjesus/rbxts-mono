import ts, { factory } from 'typescript'

import createEventMethodCallback from '../../../../helpers/ts/create-event-method-callback'
import CodegenEvent from '../context/event'

function createEventMethodInitializer({ MethodName, EventName }: CodegenEvent) {
  return factory.createIfStatement(
    factory.createBinaryExpression(
      factory.createStringLiteral(MethodName),
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
                factory.createIdentifier(EventName)
              ),
              factory.createIdentifier('Connect')
            ),
            undefined,
            [createEventMethodCallback(MethodName)]
          )
        ),
      ],
      true
    ),
    undefined
  )
}

function createRemoveTask(value: ts.Expression) {
  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createThis(),
          factory.createIdentifier('DestroyTasks')
        ),
        factory.createIdentifier('Add')
      ),
      undefined,
      [
        value,
        factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('removable'),
              factory.createFalse()
            ),
          ],
          false
        ),
      ]
    )
  )
}

export default createEventMethodInitializer
