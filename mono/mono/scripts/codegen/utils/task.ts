import ora, { Ora } from 'ora'

const now = () => Number(process.hrtime.bigint()) / 1e9
const fmt = (n: number) => n.toFixed(2).replace('.00', '')

export default class Task {
  readonly name: string
  readonly startedAt: number

  private readonly spinner: Ora

  constructor(name: string) {
    this.name = name
    this.startedAt = now()
    this.spinner = ora(`Running ${name}...`)
  }

  getElapsed() {
    return now() - this.startedAt
  }

  start() {
    this.spinner.start()
  }

  succeed() {
    this.spinner.succeed(`Ran ${this.name} in ${fmt(this.getElapsed())}s`)
  }

  fail() {
    this.spinner.fail(`Failed ${this.name} after ${fmt(this.getElapsed())}s`)
  }

  run<Return>(callback: () => Return) {
    this.start()
    try {
      const result = callback()
      this.succeed()
      return result
    } catch (e) {
      this.fail()
      throw e
    }
  }
}
