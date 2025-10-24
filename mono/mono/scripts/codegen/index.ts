import path from 'path'

import generateComponents from './generators/generate-components'
import extractComponentOptions from './introspectors/extract-component-options'
import Task from './utils/task'

const introspection = new Task('type extraction')
const codegen = new Task('component generation')

function main() {
  const options = introspection.run(extractComponentOptions)

  codegen.run(() => {
    generateComponents(
      options,
      path.resolve(__dirname, '../../src/generated/components.ts')
    )
  })
}

void main()
