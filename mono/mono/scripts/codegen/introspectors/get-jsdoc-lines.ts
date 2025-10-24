import ts from 'typescript'

export default function getJSDocLines(node: ts.Node): string[] {
  const jsDocLines: string[] = []
  const jsDocComments = ts.getJSDocCommentsAndTags(node)

  for (const jsDoc of jsDocComments) {
    if (ts.isJSDoc(jsDoc) && jsDoc.comment) {
      if (typeof jsDoc.comment === 'string') {
        // Handle simple string comments
        jsDocLines.push(...jsDoc.comment.split('\n'))
      } else if (Array.isArray(jsDoc.comment)) {
        // Handle JSDocComment array
        for (const part of jsDoc.comment as (ts.JSDocComment | string)[]) {
          if (typeof part === 'string') {
            jsDocLines.push(...part.split('\n'))
          } else if (part.kind === ts.SyntaxKind.JSDocText) {
            jsDocLines.push(...part.text.split('\n'))
          }
        }
      }
    }
  }

  return jsDocLines.filter((line) => line.trim().length > 0)
}
