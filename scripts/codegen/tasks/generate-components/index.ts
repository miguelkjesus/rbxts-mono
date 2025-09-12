import { write } from '../../helpers/files'

import RobloxData from './helpers/roblox-data'
import CodegenContext from './context'
import generateComponentsSource from './helpers/ts/generate-components-source'

async function generateComponents() {
  const context = new CodegenContext(await RobloxData.fetch())
  write('generated/components.ts', await generateComponentsSource(context))
}

// TODO add service provider generic: DataModelComponent extends ServiceProviderComponent<Services>

export default generateComponents
