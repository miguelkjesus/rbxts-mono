import { Component } from 'component'
import { runGetter } from 'internal/decorator-utils'
import { MethodDecorator } from 'type-utils'

export function On<This extends Component, Params extends unknown[]>(
  signal: RBXScriptSignal<(...args: Params) => void>
): MethodDecorator<(this: This, ...args: Params) => void>

export function On<This extends Component, Params extends unknown[]>(
  getSignal: (self: This) => RBXScriptSignal<(...args: Params) => void>
): MethodDecorator<(this: This, ...args: Params) => void>

export function On<This extends Component, Params extends unknown[]>(
  signalOrGetter:
    | RBXScriptSignal<(...args: Params) => void>
    | ((self: This) => RBXScriptSignal<(...args: Params) => void>)
) {
  const decorator: MethodDecorator<(this: This, ...args: Params) => void> = (
    target,
    _,
    descriptor
  ) => {
    const signal = runGetter(signalOrGetter, target)

    const connection = signal.Connect((...args: Params) =>
      descriptor.value(target, ...args)
    )

    target.Destroying.Connect(() => connection.Disconnect())

    return descriptor
  }

  return decorator
}
