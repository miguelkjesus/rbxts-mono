import { KeyOfValue } from 'internal/type-utils'

export type ClassNameOf<T> = KeyOfValue<Objects, T>

export type AnyKey = string | number | symbol | Services

export type MethodDecorator<
  Fn extends Callback = Callback,
  Name extends AnyKey = AnyKey,
> = (
  target: InferThis<Fn>,
  name: Name,
  descriptor: PropertyWithTypeDecorator<Fn, InferThis<Fn>>
) => PropertyWithTypeDecorator<Fn, InferThis<Fn>>

export type PropertyDecorator<Name extends AnyKey = AnyKey, This = unknown> = (
  target: This,
  name: Name
) => void

export type PropertyWithTypeDecorator<
  T = unknown,
  This = unknown,
> = PropertyDecorator<ExtractKeys<This, T>, This>

export type SignalParameters<T> =
  T extends RBXScriptSignal<infer Fn> ? Parameters<Fn> : never

export type SuggestString<T> = T extends string ? T | (string & {}) : string

export type PropertyNames<T> = keyof (T extends RBXObject
  ? Exclude<T, RBXScriptSignal | Callback | symbol>
  : T)
