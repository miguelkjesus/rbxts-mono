import ts, { factory } from "typescript";

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

function generateSource(statements: readonly ts.Statement[]) {
  return printer.printFile(
    factory.createSourceFile(
      statements,
      factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    )
  )
}

export default generateSource
