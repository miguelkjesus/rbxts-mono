import { ESLint } from 'eslint'

async function eslint() {
  const files = ['src/generated/**/*.ts']

  const eslint = new ESLint({ fix: true })
  await ESLint.outputFixes(await eslint.lintFiles(files))
}

export default eslint
