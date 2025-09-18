import { KeyOfValue } from 'internal/type-utils'

export type ClassNameOf<T> = KeyOfValue<Objects, T>

export type MethodDecorator<
  Fn extends Callback = Callback,
  Name extends keyof InferThis<Fn> = keyof InferThis<Fn>,
> = (
  target: InferThis<Fn>,
  name: Name,
  descriptor: TypedPropertyDescriptor<Fn>
) => TypedPropertyDescriptor<Fn>

export type PropertyDecorator<
  Target extends object = object,
  Name extends keyof Target | undefined = undefined,
> = <This extends Target>(
  target: This,
  name: Name extends undefined ? keyof This : Name
) => void

export type SignalParameters<T> =
  T extends RBXScriptSignal<infer Fn> ? Parameters<Fn> : never

export type SuggestString<T> = T extends string ? T | (string & {}) : string
