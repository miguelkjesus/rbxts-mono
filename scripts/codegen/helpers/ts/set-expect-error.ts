import ts from 'typescript'

function setExpectError(node: ts.Node, reason: string) {
  ts.setSyntheticLeadingComments(node, [
    {
      pos: -1,
      end: -1,
      kind: ts.SyntaxKind.SingleLineCommentTrivia,
      text: ` @ts-expect-error ${reason}`,
      hasTrailingNewLine: true,
    },
  ])
}

export default setExpectError
