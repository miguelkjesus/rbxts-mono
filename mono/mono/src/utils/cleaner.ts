export type Cleanable =
  | (() => void)
  | thread
  | RBXScriptConnection
  | Cleaner
  | { Destroy: () => void }
  | undefined

export interface Task {
  item: Cleanable
  removable: boolean
}

export interface CleanerAddOptions {
  removable?: boolean
}

export class Cleaner {
  private readonly Tasks = new Map<Cleanable, Task>()

  GetTasks() {
    return [...this.Tasks].map(([_, task]) => task)
  }

  Add(item: Cleanable, { removable = true }: CleanerAddOptions = {}) {
    if (item === undefined) return

    this.Tasks.set(item, { item, removable })
  }

  IsRemovable(item: Cleanable) {
    if (item === undefined) return

    return this.Tasks.get(item)?.removable
  }

  TryRemove(item: Cleanable) {
    if (item === undefined) return

    if (this.IsRemovable(item) ?? true) {
      this.Tasks.delete(item)
      return true
    } else {
      return false
    }
  }

  Clean(item: Cleanable) {
    if (item === undefined) return

    if (typeIs(item, 'function')) {
      item()
    } else if (typeIs(item, 'thread')) {
      const cancelled =
        coroutine.running() === item ? false : pcall(() => task.cancel(item))[0]

      if (!cancelled) {
        task.defer(() => task.cancel(item))
      }
    } else if (typeIs(item, 'RBXScriptConnection')) {
      item.Disconnect()
    } else if (item instanceof Cleaner) {
      item.CleanAll()
    } else if ('Destroy' in item) {
      item.Destroy()
    } else if (item !== undefined) {
      error('Cannot clean this item')
    }

    this.Tasks.delete(item)
  }

  CleanAll() {
    for (const { item } of this.GetTasks()) {
      this.Clean(item)
    }
  }

  Destroy() {
    this.CleanAll()
  }
}
