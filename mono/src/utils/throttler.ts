export class Throttler {
  private lastReady = -1

  Ready(interval: number) {
    const now = os.clock()

    if (now - this.lastReady < interval) return false

    this.lastReady = now
    return true
  }

  GetLastReady() {
    return this.lastReady
  }
}
