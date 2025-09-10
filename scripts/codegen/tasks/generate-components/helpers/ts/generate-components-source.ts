import { ApiClass } from '../api-dump'
import isClassAllowed from '../class-blacklist'
import generateSource from '../../../../helpers/ts/generate-source'
import importDependencies from '../../../../helpers/ts/import'
import createComponentClass from './create-component-class-declaration'

async function generateComponentsSource(Classes: ApiClass[]) {
  return await generateSource([
    importDependencies(['SignalParameters'], 'types'),
    importDependencies(['Component'], 'component'),
    ...Classes.filter(isClassAllowed).map(createComponentClass),
  ])
}

export default generateComponentsSource
