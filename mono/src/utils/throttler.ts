export class Throttler {
  interval: number
  private lastReady = -1

  constructor(interval = 0) {
    this.interval = interval
  }

  IsReady(interval = this.interval) {
    return os.clock() - this.lastReady >= interval
  }

  ForceTick() {
    this.lastReady = os.clock()
    return true as const
  }

  TryTick(interval = this.interval) {
    if (this.IsReady(interval)) {
      this.lastReady = os.clock()
      return true
    }

    return false
  }

  GetLastReady() {
    return this.lastReady
  }
}
