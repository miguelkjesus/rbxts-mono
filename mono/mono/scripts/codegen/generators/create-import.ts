import { factory } from 'typescript'

export default function createImport(dependencies: string[], from: string) {
  return factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      undefined,
      undefined,
      factory.createNamedImports(
        dependencies.map((name) =>
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier(name)
          )
        )
      )
    ),
    factory.createStringLiteral(from),
    undefined
  )
}
