import generateSource from '../../../../helpers/ts/generate-source'
import importDependencies from '../../../../helpers/ts/import'

import CodegenContext from '../../context'

import createComponentClass from './create-component-class-declaration'

async function generateComponentsSource({ Classes }: CodegenContext) {
  return await generateSource([
    importDependencies(['SignalParameters'], 'types'),
    importDependencies(['Component'], 'component'),
    ...Classes.map(createComponentClass),
  ])
}

export default generateComponentsSource
