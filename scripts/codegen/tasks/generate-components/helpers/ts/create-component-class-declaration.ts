import ts, { factory } from 'typescript'

import setJsDocComment from '../../../../helpers/ts/set-jsdoc'

import CodegenComponent, { TypeParameter } from '../../context/component'

import createEventMethodInitializer from './create-event-method-initializer'
import createEventMethod from './create-event-method'

function createComponentClass({
  ComponentName,
  ClassType,
  StaticClassType,
  TypeParameters,
  SuperClassComponentName,
  SuperClassTypeArguments,
  ClassName,
  Events,
  Documentation,
}: CodegenComponent) {
  const cls = factory.createClassDeclaration(
    [
      factory.createToken(ts.SyntaxKind.ExportKeyword),
      factory.createToken(ts.SyntaxKind.AbstractKeyword),
    ],
    factory.createIdentifier(ComponentName),
    createTypeParameters(TypeParameters),
    [createExtends(SuperClassComponentName, SuperClassTypeArguments)],
    [
      declareInstanceProperty(ClassType),
      createIsClassMethod(ClassName, StaticClassType),
      createConstructor(ClassType, [
        ...Events.map(createEventMethodInitializer),
      ]),
      ...Events.map(createEventMethod),
    ]
  )

  setJsDocComment(cls, [Documentation])

  return cls
}

function createTypeParameters(params?: readonly TypeParameter[]) {
  if (!params || params.length === 0) return undefined

  return params.map((param) =>
    factory.createTypeParameterDeclaration(
      undefined,
      factory.createIdentifier(param.Name),
      undefined,
      param.Default
    )
  )
}

function createExtends(name: string, params?: readonly string[]) {
  return factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
    factory.createExpressionWithTypeArguments(
      factory.createIdentifier(name),
      createSuperClassTypeArguments(params)
    ),
  ])
}

function createSuperClassTypeArguments(params?: readonly string[]) {
  if (!params || params.length === 0) return undefined

  return params.map((param) =>
    factory.createTypeReferenceNode(factory.createIdentifier(param), undefined)
  )
}

function createIsClassMethod(className: string, type: ts.TypeNode) {
  return factory.createMethodDeclaration(
    [factory.createToken(ts.SyntaxKind.StaticKeyword)],
    undefined,
    factory.createIdentifier('IsClass'),
    undefined,
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        factory.createIdentifier('instance'),
        undefined,
        factory.createTypeReferenceNode(
          factory.createIdentifier('RBXObject'),
          undefined
        ),
        undefined
      ),
    ],
    factory.createTypePredicateNode(
      undefined,
      factory.createIdentifier('instance'),
      type
    ),
    factory.createBlock(
      [
        factory.createReturnStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('instance'),
              factory.createIdentifier('IsA')
            ),
            undefined,
            [factory.createStringLiteral(className)]
          )
        ),
      ],
      true
    )
  )
}

function declareInstanceProperty(type: ts.TypeNode) {
  return factory.createPropertyDeclaration(
    [
      factory.createToken(ts.SyntaxKind.DeclareKeyword),
      factory.createToken(ts.SyntaxKind.ReadonlyKeyword),
    ],
    factory.createIdentifier('Instance'),
    undefined,
    type,
    undefined
  )
}

function createConstructor(type: ts.TypeNode, body: readonly ts.Statement[]) {
  return factory.createConstructorDeclaration(
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        factory.createIdentifier('instance'),
        undefined,
        type,
        undefined
      ),
    ],
    factory.createBlock([superCall, ...body], true)
  )
}

const superCall = factory.createExpressionStatement(
  factory.createCallExpression(factory.createSuper(), undefined, [
    factory.createIdentifier('instance'),
  ])
)

export default createComponentClass
