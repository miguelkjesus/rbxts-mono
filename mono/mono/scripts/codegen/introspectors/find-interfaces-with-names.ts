import ts from 'typescript'

import { packageName } from './consts'

export default function findInterfacesWithNames(
  names: Set<string>,
  program: ts.Program
) {
  const remainingNames = new Set(names)
  const interfaces: ts.InterfaceDeclaration[] = []

  for (const file of program.getSourceFiles()) {
    if (!file.fileName.includes(packageName)) continue

    console.log(file.fileName)

    ts.forEachChild(file, (node) => {
      if (
        ts.isInterfaceDeclaration(node) &&
        remainingNames.has(node.name.text)
      ) {
        interfaces.push(node)
        remainingNames.delete(node.name.text)
      }
    })
  }

  if (remainingNames.size > 0) {
    throw new Error(
      `Could not find interfaces for: ${[...remainingNames].join(', ')}`
    )
  }

  return interfaces
}
