import ts, { factory } from 'typescript'

import { ApiEvent } from '../api-dump'
import {
  getSafeHookName,
  getSafeParameterName,
} from '../../../../helpers/ts/alias'

function createHookMethod(typeName: string, { Name }: ApiEvent) {
  const eventName = getSafeParameterName(Name)
  const hookName = getSafeHookName(Name)

  return factory.createMethodDeclaration(
    [factory.createToken(ts.SyntaxKind.ProtectedKeyword)],
    undefined,
    factory.createIdentifier(hookName),
    factory.createToken(ts.SyntaxKind.QuestionToken),
    undefined,
    createEventParameters(typeName, eventName),
    factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
    undefined
  )
}

function createEventParameters(typeName: string, eventName: string) {
  return [
    factory.createParameterDeclaration(
      undefined,
      factory.createToken(ts.SyntaxKind.DotDotDotToken),
      factory.createIdentifier('args'),
      undefined,
      factory.createTypeReferenceNode(
        factory.createIdentifier('SignalParameters'),
        [
          factory.createIndexedAccessTypeNode(
            factory.createTypeReferenceNode(
              factory.createIdentifier(typeName),
              undefined
            ),
            factory.createLiteralTypeNode(
              factory.createStringLiteral(eventName)
            )
          ),
        ]
      ),
      undefined
    ),
  ]
}

export default createHookMethod
