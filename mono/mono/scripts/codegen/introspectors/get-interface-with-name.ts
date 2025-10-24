import ts from 'typescript'

import { packageName } from './consts'

export default function getInterfaceWithName(
  name: string,
  program: ts.Program
) {
  for (const file of program.getSourceFiles()) {
    if (!file.fileName.includes(packageName)) continue

    const iface = ts.forEachChild(file, (node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === name) {
        return node
      }
    })

    if (iface) return iface
  }

  throw new Error(`Could not find an interface with name ${name}`)
}
