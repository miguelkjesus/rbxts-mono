import ts from 'typescript'

export default function getInterfaces(file: ts.SourceFile) {
  const interfaces = new Map<string, ts.InterfaceDeclaration>()

  function collectInterfaces(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.set(node.name.text, node)
    }
    ts.forEachChild(node, collectInterfaces)
  }

  collectInterfaces(file)
  return interfaces
}
