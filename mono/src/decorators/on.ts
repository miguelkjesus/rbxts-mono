import { runGetter } from 'internal/decorator-utils'
import { PropertyDecorator } from 'types'

export function On<This extends object, Params extends unknown[]>(
  signalOrGetter:
    | RBXScriptSignal<(...args: Params) => void>
    | ((self: This) => RBXScriptSignal<(...args: Params) => void>)
) {
  const decorator: PropertyDecorator<(this: This, ...args: Params) => void> = (
    target,
    _,
    descriptor
  ) => {
    const signal = runGetter(signalOrGetter, target)
    signal.Connect((...args: Params) => descriptor.value(target, ...args))
    return descriptor
  }

  return decorator
}
