import ts from 'typescript'

import findInterfacesWithNames from './find-interfaces-with-names'
import getAllInterfaceMembers from './get-all-interface-members'
import getInterfaceWithName from './get-interface-with-name'

export default function getObjectInterfaces(program: ts.Program) {
  const objects = getInterfaceWithName('Objects', program)

  const checker = program.getTypeChecker()
  const objectNames = getAllInterfaceMembers(objects, checker).map((member) => {
    const type = checker.getTypeOfSymbolAtLocation(
      member,
      member.valueDeclaration!
    )
    return type.symbol?.name ?? checker.typeToString(type).split('<')[0]
  })

  return findInterfacesWithNames(new Set(objectNames), program)
}
