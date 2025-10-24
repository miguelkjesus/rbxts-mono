import ts, { factory } from 'typescript'

function createSource(statements: readonly ts.Statement[]) {
  return createSource.printer.printFile(
    factory.createSourceFile(
      statements,
      factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    )
  )
}

namespace createSource {
  export const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
}

export default createSource
