import path from 'path'
import ts from 'typescript'

function getPackageEntryName(
  name: string,
  { host, options, basePath }: getPackageEntry.Options
) {
  // Any absolute path within the base path
  const containingFile = path.resolve(basePath, '__virtual__.ts')

  const { resolvedModule } = ts.resolveModuleName(
    name,
    containingFile,
    options,
    host
  )

  if (!resolvedModule) {
    throw new Error(`Could not find the entry declaration file for '${name}'`)
  }

  return resolvedModule.resolvedFileName
}

namespace getPackageEntry {
  export interface Options {
    host: ts.ModuleResolutionHost
    options: ts.CompilerOptions
    basePath: string
  }
}

export default getPackageEntryName
