import ts, { factory } from 'typescript'

export default function createRemoveTask(value: ts.Expression) {
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
