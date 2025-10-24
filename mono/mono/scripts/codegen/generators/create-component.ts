import ts, { factory } from 'typescript'

import createExtends from './create-extends'
import createOnEventMethod from './create-on-event-method'
import createOnEventMethodInitializer from './create-on-event-method-initializer'
import setJsDocComment from './set-jsdoc'

function createComponent({
  name,
  typeParameters,
  extendsType,
  instanceType,
  instanceName,
  isClassType = instanceType,
  events,
  jsDocLines = [],
}: createComponent.Options) {
  const cls = factory.createClassDeclaration(
    [
      factory.createToken(ts.SyntaxKind.ExportKeyword),
      factory.createToken(ts.SyntaxKind.AbstractKeyword),
    ],
    factory.createIdentifier(name),
    typeParameters,
    createExtends(extendsType),
    [
      createDeclareInstanceType(instanceType),
      createIsClassMethod(instanceName, isClassType),
      createComponentConstructor(instanceType, [
        ...(extendsType ? [superCall] : []),
        ...events.map(createOnEventMethodInitializer),
      ]),
      ...events.map((event) => createOnEventMethod({ ...event, instanceType })),
    ]
  )

  setJsDocComment(cls, jsDocLines)

  return cls
}

namespace createComponent {
  export interface Options {
    /** The name of the component: `class BasePartComponent`  */
    name: string
    /** Type parameters of the class: `class Component<Foo, const Bar extends string>` */
    typeParameters?: readonly ts.TypeParameterDeclaration[]
    /** What the component extends: `extends InstanceComponent` */
    extendsType?: ts.ExpressionWithTypeArguments
    /** The type of the instance that this component is of: `RBXObject` */
    instanceType: ts.TypeNode
    /**
     * `IsClass(instance: RBXObject): instance is isClassType`
     *
     * defaults to `instanceType`
     */
    isClassType?: ts.TypeNode
    /** The roblox name of the instance: `Object` */
    instanceName: string
    events: {
      eventName: string
      methodName: string
      jsDoc?: readonly string[]
    }[] // TODO
    jsDocLines?: readonly string[]
  }
}

export default createComponent

function createDeclareInstanceType(type: ts.TypeNode) {
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

function createIsClassMethod(instanceName: string, isType: ts.TypeNode) {
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
      isType
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
            [factory.createStringLiteral(instanceName)]
          )
        ),
      ],
      true
    )
  )
}

function createComponentConstructor(
  instanceType: ts.TypeNode,
  body: readonly ts.Statement[]
) {
  return factory.createConstructorDeclaration(
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        factory.createIdentifier('instance'),
        undefined,
        instanceType,
        undefined
      ),
    ],
    factory.createBlock(body, true)
  )
}

const superCall = factory.createExpressionStatement(
  factory.createCallExpression(factory.createSuper(), undefined, [
    factory.createIdentifier('instance'),
  ])
)
