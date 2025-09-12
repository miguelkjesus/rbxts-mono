import { ESLint } from 'eslint'

async function eslint() {
  const files = ['src/generated/**/*']

  const eslint = new ESLint({
    fix: true,
    overrideConfig: {
      ignores: files.map((file) => `!${file}`),
    },
  })
  await ESLint.outputFixes(await eslint.lintFiles(files))
}

export default eslint
