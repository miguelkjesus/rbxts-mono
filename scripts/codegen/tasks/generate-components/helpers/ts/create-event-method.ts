import ts, { factory } from 'typescript'

import setJsDocComment from '../../../../helpers/ts/set-jsdoc'
import CodegenEvent from '../../context/event'

function createEventMethod({
  MethodName,
  EventName,
  Component,
  Documentation,
}: CodegenEvent) {
  const method = factory.createMethodDeclaration(
    [factory.createToken(ts.SyntaxKind.ProtectedKeyword)],
    undefined,
    factory.createIdentifier(MethodName),
    factory.createToken(ts.SyntaxKind.QuestionToken),
    undefined,
    createEventParameters(Component.ClassType, EventName),
    factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
    undefined
  )

  setJsDocComment(method, [Documentation])

  return method
}

function createEventParameters(type: ts.TypeNode, eventName: string) {
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
            type,
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

export default createEventMethod
