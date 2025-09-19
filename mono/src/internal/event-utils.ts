export function event<Params extends unknown[]>(): BindableEvent<
  (...args: Params) => void
> {
  return new Instance('BindableEvent')
}
