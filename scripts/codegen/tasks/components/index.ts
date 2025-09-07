import getApiDump from "../../helpers/api-dump"
import generateComponentsSource from "./ts/generate-components-source";
import { write } from "../../helpers/files";

async function components() {
  const { Classes } = await getApiDump();

  write("generated/components.ts", generateComponentsSource(Classes))
}

export default components
