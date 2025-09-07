import path from "path";
import fs from "fs";

import runMacros from "./macros";

export function resolve(file: string) {
  return path.resolve("src", file)
}

export function read(file: string) {
  return runMacros(fs.readFileSync(resolve(file)).toString())
}

export function write(file: string, contents: string) {
  fs.writeFileSync(resolve(file), contents)
}
