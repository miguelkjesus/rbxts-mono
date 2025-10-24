import ts, { factory } from 'typescript'

import setJsDocComment from './set-jsdoc'

function createOnEventMethod({
  eventName,
  methodName,
  instanceType,
  jsDocLines = [],
}: createOnEventMethod.Options) {
  const method = factory.createMethodDeclaration(
    [factory.createToken(ts.SyntaxKind.ProtectedKeyword)],
    undefined,
    factory.createIdentifier(methodName),
    factory.createToken(ts.SyntaxKind.QuestionToken),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        factory.createToken(ts.SyntaxKind.DotDotDotToken),
        factory.createIdentifier('args'),
        undefined,
        factory.createTypeReferenceNode(
          factory.createIdentifier('SignalParameters'),
          [
            factory.createIndexedAccessTypeNode(
              instanceType,
              factory.createLiteralTypeNode(
                factory.createStringLiteral(eventName)
              )
            ),
          ]
        ),
        undefined
      ),
    ],
    factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
    undefined
  )

  setJsDocComment(method, jsDocLines)

  return method
}

namespace createOnEventMethod {
  export interface Options {
    eventName: string
    methodName: string
    instanceType: ts.TypeNode
    jsDocLines?: string[]
  }
}

export default createOnEventMethod
