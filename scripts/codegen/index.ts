import runTasks from './helpers/run-tasks'

import generateComponents from './tasks/generate-components'
import eslint from './tasks/eslint'

void runTasks({ generateComponents }, { eslint })
