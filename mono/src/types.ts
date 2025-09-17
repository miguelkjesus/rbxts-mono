import { KeyOfValue } from 'internal/type-utils'

export type ClassNameOf<T> = KeyOfValue<Objects, T>

export type PropertyDecorator<Fn extends Callback> = (
  target: InferThis<Fn>,
  name: string | number,
  descriptor: TypedPropertyDescriptor<Fn>
) => TypedPropertyDescriptor<Fn>

export type SignalParameters<T> =
  T extends RBXScriptSignal<infer Fn> ? Parameters<Fn> : never
