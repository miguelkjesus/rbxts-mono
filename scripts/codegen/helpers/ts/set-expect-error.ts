import ts from "typescript";

function setExpectError(node: ts.Node) {
  ts.setSyntheticLeadingComments(node, [
    {
      pos: -1,
      end: -1,
      kind: ts.SyntaxKind.SingleLineCommentTrivia,
      text: " @ts-expect-error",
      hasTrailingNewLine: true,
    },
  ]);
}

export default setExpectError
