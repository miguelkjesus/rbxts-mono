import ts from 'typescript'

import getPackageEntryName from './get-package-entry'
import getTSConfig from './get-ts-config'

export default function getPackageProgram(name: string) {
  const {
    tsconfig: { options },
    basePath,
  } = getTSConfig()

  const host = ts.createCompilerHost(options, true)

  const entryName = getPackageEntryName(name, {
    basePath,
    options,
    host,
  })

  const program = ts.createProgram({
    rootNames: [entryName],
    options,
    host,
  })

  return program
}
