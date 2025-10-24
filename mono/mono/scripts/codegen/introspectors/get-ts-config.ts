import path from 'path'
import ts from 'typescript'

export default function getTSConfig() {
  const tsconfigPath = ts.findConfigFile(
    __dirname,
    ts.sys.fileExists,
    'tsconfig.json'
  )

  if (!tsconfigPath) {
    throw new Error('Could not find tsconfig.json')
  }

  const basePath = path.dirname(tsconfigPath)
  const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  const tsconfig = ts.parseJsonConfigFileContent(
    tsconfigFile.config,
    ts.sys,
    __dirname
  )

  return { tsconfig, basePath }
}
