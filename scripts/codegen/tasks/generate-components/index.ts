import getApiDump from './helpers/api-dump'
import generateComponentsSource from './helpers/ts/generate-components-source'
import { write } from '../../helpers/files'

async function generateComponents() {
  const { Classes } = await getApiDump()

  write('generated/components.ts', await generateComponentsSource(Classes))
}

export default generateComponents
