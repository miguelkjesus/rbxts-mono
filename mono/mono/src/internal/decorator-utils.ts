export function runGetter<This extends object, T>(
  valueOrGetter: T | ((self: This) => T),
  target: This
) {
  return typeIs(valueOrGetter, 'function')
    ? valueOrGetter(target)
    : valueOrGetter
}
