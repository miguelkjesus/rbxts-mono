import ts from 'typescript'

type StringLike = { toString(): string }

export default function setJsDocComment(
  node: ts.Node,
  lines: (StringLike | undefined)[]
) {
  let strings = lines
    .filter((line) => line !== undefined)
    .map((line) => line.toString())
    .join('\n')
    .trim()
    .split('\n')

  while (strings.at(-1)?.trim() === '') strings.pop()

  if (strings.length === 0) return

  strings = strings.map((v) => ` * ${v}`)

  strings.unshift('*')
  strings.push(' ')

  const text = strings.join('\n')

  ts.setSyntheticLeadingComments(node, [
    {
      pos: -1,
      end: -1,
      kind: ts.SyntaxKind.MultiLineCommentTrivia,
      text,
      hasTrailingNewLine: true,
    },
  ])
}
