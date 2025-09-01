import fs from "fs";
import path from "path";

export function fileFactory(
  templateName: string,
  dir: string,
  fileContexts: (Record<string, string>)[]
) {
  for (const filePath of fs.globSync(`**/${templateName}.factory.*`)) {
    const fileName = path.basename(filePath)
    const ext = path.extname(fileName)

    const template = fs.readFileSync(filePath).toString();

    const basedir = path.join("src", dir)

    if (fs.statSync(basedir).isDirectory()) {
      fs.rmSync(basedir, { recursive: true, force: true })
    }
    fs.mkdirSync(basedir, { recursive: true })

    let indexContents = "";

    for (const context of fileContexts) {
      const newContents = populateTemplate(removeMarkedLines(template), context);
      const newFilePath = path.join(basedir, context.name + ext)

      fs.writeFileSync(newFilePath, newContents)
      indexContents += `export * from "./${context.name}";\n`
    }

    const indexFilePath = path.join(basedir, "index.ts");
    fs.writeFileSync(indexFilePath, indexContents);
  }
}

function removeMarkedLines(template: string) {
  const regex = /^[ \t]*\/\/\s*@remove\s+start[\s\S]*?\/\/\s*@remove\s+end[ \t]*$/gm
  return template.replaceAll(regex, "")
}

function populateTemplate(template: string, context: Record<string, string>) {
  // Ordered by largest keys first to prevent collisions
  let contextEntries = Object
    .entries(context)
    .filter(([key]) => key.startsWith("__") && key.endsWith("__"))
    .sort(([key0], [key1]) => key1.length - key0.length)

  let lastPass = ""
  let currentPass = template

  while (currentPass !== lastPass) {
    lastPass = currentPass;

    for (const [key, value] of contextEntries) {
      currentPass = currentPass.replaceAll(key, value);
    }
  }

  return currentPass;
}
