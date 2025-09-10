import path from 'path'
import fs from 'fs'

export function resolve(file: string) {
  return path.resolve('src', file)
}

export function read(file: string) {
  return fs.readFileSync(resolve(file)).toString()
}

export function write(file: string, contents: string) {
  fs.writeFileSync(resolve(file), contents)
}
