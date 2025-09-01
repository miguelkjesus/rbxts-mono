import { CLASS_BLACKLIST } from "./class-blacklist";
import { fileFactory } from "./file-factory"
import { getApiDump } from "./get-api-dump"

async function main() {
  const { Classes } = await getApiDump();
  
  const files: {
    name: string
    __ClassName_StringLiteral__: string;
    __Type__: string;
    __ComponentName__: string;
  }[] = [{
    name: "BaseComponent",
    __ClassName_StringLiteral__: '"" as keyof Objects',
    __Type__: 'RBXObject',
    __ComponentName__: "BaseComponent" 
  }] 

  for (const { Name } of Classes) {
    if (CLASS_BLACKLIST.has(Name)) continue;

    const __ClassName_StringLiteral__ = `"${Name}"`
    const __Type__ = Name === "Object" ? "RBXObject" : Name;
    const __ComponentName__ = `${Name}Component`

    files.push({
      name: __ComponentName__,
      __ClassName_StringLiteral__,
      __Type__,
      __ComponentName__,
    })
  }

  fileFactory("component", "generated/components", files);
}

void main();
