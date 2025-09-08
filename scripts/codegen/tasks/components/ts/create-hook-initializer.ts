import ts, { factory } from "typescript";

import { ApiEvent } from "../../../helpers/api-dump";
import createEventMethodCallback from "../../../helpers/ts/create-event-method-callback";
import { getSafeHookName } from "../../../helpers/ts/alias";

function createHookInitializer({ Name }: ApiEvent) {
  const hookName = getSafeHookName(Name)

  return factory.createIfStatement(
    factory.createBinaryExpression(
      factory.createStringLiteral(hookName),
      factory.createToken(ts.SyntaxKind.InKeyword),
      factory.createThis()
    ),
    factory.createBlock(
      [createRemoveTask(factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createThis(),
              factory.createIdentifier("Instance")
            ),
            factory.createIdentifier(Name)
          ),
          factory.createIdentifier("Connect")
        ),
        undefined,
        [createEventMethodCallback(hookName)]
      ))],
      true
    ),
    undefined
  )
}

function createRemoveTask(value: ts.Expression) {
  return factory.createExpressionStatement(factory.createCallExpression(
    factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createThis(),
          factory.createIdentifier("DestroyTasks")
        ),
        factory.createIdentifier("Add")
      ),
      undefined,
      [
        value,
        factory.createObjectLiteralExpression(
          [factory.createPropertyAssignment(
            factory.createIdentifier("removable"),
            factory.createFalse()
          )],
          false
        )
      ]
    ))
}

export default createHookInitializer
