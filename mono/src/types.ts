import { KeyOfValue } from 'internal/types'

export type ClassNameOf<T> = KeyOfValue<Objects, T>

export type MethodDecorator<Fn extends Callback> = (
  target: InferThis<Fn>,
  methodName: string | symbol | number,
  descriptor: TypedPropertyDescriptor<Fn>
) => TypedPropertyDescriptor<Fn>

export type SignalParameters<T> =
  T extends RBXScriptSignal<infer Fn> ? Parameters<Fn> : never
