
export type Cleanable =
  | (() => void)
  | thread
  | RBXScriptConnection
  | Maid
  | { Destroy: () => void }

export class Maid {
  protected readonly Items = new Set<Cleanable>();

  Add(Item: Cleanable) {
    this.Items.add(Item);
  }

  Remove(Item: Cleanable) {
    this.Items.delete(Item);
  }

  Clean() {
    for (const item of this.Items) {
      if (typeIs(item, "function")) {
        item()
      } else if (typeIs(item, "thread")) {
        const cancelled = coroutine.running() === item
          ? false
          : pcall(() => task.cancel(item))[0]

        if (!cancelled) {
          task.defer(() => task.cancel(item))
        }
      } else if (typeIs(item, "RBXScriptConnection")) {
        item.Disconnect()
      } else if (item instanceof Maid) {
        item.Clean()
      } else {
        item.Destroy?.()
      }
    }

    this.Items.clear()
  }

  Destroy() {
    this.Clean()
  }
}