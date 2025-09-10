import ora from 'ora'

const now = () => Number(process.hrtime.bigint()) / 1e9
const fmt = (n: number) => n.toFixed(2).replace('.00', '')

async function runTask(
  name: string,
  task: () => Promise<void> | void
): Promise<boolean> {
  const spinner = ora(`Running ${name}...`).start()
  const startedAt = now()

  try {
    await task()
    spinner.succeed(`Ran ${name} in ${fmt(now() - startedAt)}s`)
    return true
  } catch (e) {
    spinner.fail(`Failed ${name} after ${fmt(now() - startedAt)}s`)
    console.error(e)
    return false
  }
}

async function runTasks(
  ...taskGroups: Record<string, () => Promise<void> | void>[]
) {
  for (const group of taskGroups) {
    const result = await Promise.all(
      Object.entries(group).map(([name, task]) => runTask(name, task))
    )

    if (!result) return
  }
}

export default runTasks
