import ts, { factory } from "typescript"

import { ApiClass, ApiEvent } from "../../../helpers/api-dump";
import { getSafeClassName } from "../../../helpers/ts/alias";

import createHookInitializer from "./create-hook-initializer";
import createHookMethod from "./create-hook-method";
import getEvents from "../../../helpers/get-events";
import setExpectError from "../../../helpers/ts/set-expect-error";

const ERRONEOUS_TYPE_NAMES = new Set(["Camera", "DataModel"])

function createComponentClass(Class: ApiClass) {
  const { Name, Superclass } = Class

  const typeName = getSafeClassName(Name)
  const componentName = `${typeName}Component`

  const Events = getEvents(Class)

  return factory.createClassDeclaration(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(componentName),
    undefined,
    [createExtendsComponent(Superclass)],
    [
      declareInstanceProperty(typeName),
      createIsClassMethod(Name, typeName),
      createConstructor(typeName, [
        ...Events.map(createHookInitializer)
      ]),
      ...Events.map((Event) => createHookMethod(typeName, Event))
    ]
  )
}

function createExtendsComponent(className: string) {
  const typeName = className === "<<<ROOT>>>"
    ? ""
    : getSafeClassName(className)

  return factory.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword,
    [factory.createExpressionWithTypeArguments(
      factory.createIdentifier(`${typeName}Component`),
      undefined
    )]
  )
}

function createIsClassMethod(className: string, typeName: string) {
  return factory.createMethodDeclaration(
    [factory.createToken(ts.SyntaxKind.StaticKeyword)],
    undefined,
    factory.createIdentifier("IsClass"),
    undefined,
    undefined,
    [factory.createParameterDeclaration(
      undefined,
      undefined,
      factory.createIdentifier("instance"),
      undefined,
      factory.createTypeReferenceNode(
        factory.createIdentifier("RBXObject"),
        undefined
      ),
      undefined
    )],
    factory.createTypePredicateNode(
      undefined,
      factory.createIdentifier("instance"),
      factory.createTypeReferenceNode(
        factory.createIdentifier(typeName),
        undefined
      )
    ),
    factory.createBlock(
      [factory.createReturnStatement(factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier("instance"),
          factory.createIdentifier("IsA")
        ),
        undefined,
        [factory.createStringLiteral(className)]
      ))],
      true
    )
  )
}

function declareInstanceProperty(typeName: string) {
  const statement = factory.createPropertyDeclaration(
    [
      factory.createToken(ts.SyntaxKind.DeclareKeyword),
      factory.createToken(ts.SyntaxKind.ReadonlyKeyword)
    ],
    factory.createIdentifier("Instance"),
    undefined,
    factory.createTypeReferenceNode(
      factory.createIdentifier(typeName),
      undefined
    ),
    undefined
  )

  if (ERRONEOUS_TYPE_NAMES.has(typeName)) {
    setExpectError(statement)
  }

  return statement
}

function createConstructor(typeName: string, body: readonly ts.Statement[]) {
  return factory.createConstructorDeclaration(
    undefined,
    [factory.createParameterDeclaration(
      undefined,
      undefined,
      factory.createIdentifier("instance"),
      undefined,
      factory.createTypeReferenceNode(
        factory.createIdentifier(typeName),
        undefined
      ),
      undefined
    )],
    factory.createBlock([createSuper(typeName), ...body], true)
  )
}

function createSuper(typeName: string) {
  const statement = factory.createExpressionStatement(factory.createCallExpression(
    factory.createSuper(),
    undefined,
    [factory.createIdentifier("instance")]
  ))

  if (ERRONEOUS_TYPE_NAMES.has(typeName)) {
    setExpectError(statement)
  }

  return statement
}

export default createComponentClass
