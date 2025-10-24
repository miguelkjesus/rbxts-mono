import ts from 'typescript'

export default function getAllInterfaceMembers(
  iface: ts.InterfaceDeclaration,
  checker: ts.TypeChecker
) {
  const symbol = checker.getSymbolAtLocation(iface.name)

  if (!symbol) {
    throw new Error(`Could not find symbol for ${iface.name.text}`)
  }

  const type = checker.getDeclaredTypeOfSymbol(symbol)

  return checker.getPropertiesOfType(type)
}
