import { MethodDecorator } from "types";

export function On<Params extends unknown[]>(
  signal: RBXScriptSignal<(...args: Params) => void>
) {
  type Fn = (...args: Params) => void

  return function (target: InferThis<Fn>, _, descriptor: TypedPropertyDescriptor<Fn>) {
    signal.Connect((...args: Params) => descriptor.value(target, ...args))
    return descriptor;
  } as MethodDecorator<(...args: Params) => void>
}
