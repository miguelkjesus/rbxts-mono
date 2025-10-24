import ts, { factory } from 'typescript'

import createComponent from '../generators/create-component'
import { packageName } from './consts'
import getJSDocLines from './get-jsdoc-lines'
import getObjectInterfaces from './get-object-interfaces'
import getPackageProgram from './get-package-program'

export default function extractComponentOptions() {
  const program = getPackageProgram(packageName)
  const objects = getObjectInterfaces(program)

  return objects.map((object) => {
    const {
      name: { text: instanceTypeName },
      typeParameters,
      heritageClauses,
      members,
    } = object

    const name = `${instanceTypeName}Component`
    const instanceName =
      instanceTypeName === 'RBXObject' ? 'Object' : instanceTypeName

    // Convert typeParameters to simple type references (remove constraints and defaults)
    const typeArgumentsForInstance = typeParameters?.map((param) =>
      factory.createTypeReferenceNode(param.name.text)
    )

    const instanceType = factory.createTypeReferenceNode(
      instanceTypeName,
      typeArgumentsForInstance
    )

    const isClassType = factory.createTypeReferenceNode(instanceTypeName)

    const extendsClause = heritageClauses?.find(
      (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword
    )

    const instanceExtendsType = extendsClause?.types[0]
    const extendsType = factory.createExpressionWithTypeArguments(
      factory.createIdentifier(
        `${instanceExtendsType?.expression.getText() ?? ''}Component`
      ),
      instanceExtendsType?.typeArguments
    )

    const events = getEventOptions(members)
    const jsDocLines = getJSDocLines(object)

    if (instanceTypeName.includes('RBXObject')) {
      console.log({
        name,
        instanceName,
      })
    }

    return {
      name,
      typeParameters,
      extendsType,
      instanceType,
      isClassType,
      instanceName,
      events,
      jsDocLines,
    } satisfies createComponent.Options
  })
}

function getEventOptions(members: readonly ts.TypeElement[]) {
  const events: {
    eventName: string
    methodName: string
    jsDocLines?: readonly string[]
  }[] = []

  for (const member of members) {
    // Look for readonly property signatures that are RBXScriptSignals
    if (
      ts.isPropertySignature(member) &&
      member.modifiers?.some(
        (mod) => mod.kind === ts.SyntaxKind.ReadonlyKeyword
      ) &&
      member.name &&
      ts.isIdentifier(member.name)
    ) {
      const propertyName = member.name.text

      if (member.type && ts.isTypeReferenceNode(member.type)) {
        const typeName = member.type.typeName
        if (ts.isIdentifier(typeName) && typeName.text === 'RBXScriptSignal') {
          const methodName = propertyName.startsWith('On')
            ? propertyName
            : `On${propertyName}`

          const eventJSDocLines = getJSDocLines(member)

          events.push({
            eventName: propertyName,
            methodName,
            jsDocLines: eventJSDocLines,
          })
        }
      }
    }
  }

  return events
}
