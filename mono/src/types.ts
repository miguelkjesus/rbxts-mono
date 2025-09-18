import { KeyOfValue } from 'internal/type-utils'

export type ClassNameOf<T> = KeyOfValue<Objects, T>

export type MethodDecorator<Fn extends Callback> = (
  target: InferThis<Fn>,
  name: string | number,
  descriptor: TypedPropertyDescriptor<Fn>
) => TypedPropertyDescriptor<Fn>

export type PropertyDecorator<This extends object> = (
  target: This,
  name: string | number
) => void

export type SignalParameters<T> =
  T extends RBXScriptSignal<infer Fn> ? Parameters<Fn> : never
