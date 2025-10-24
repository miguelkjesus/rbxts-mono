import fs from 'fs'
import path from 'path'

import createComponent from './create-component'
import createImport from './create-import'
import createSource from './create-source'

export default function generateComponents(
  options: createComponent.Options[],
  filepath: string
) {
  const source = createSource([
    createImport(['SignalParameters'], 'type-utils'),
    createImport(['Component'], 'component'),
    ...options.map(createComponent),
  ])

  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, source)
}
