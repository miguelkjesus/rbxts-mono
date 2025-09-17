export function runGetter<This extends object, T>(
  valueOrGetter: T | ((self: This) => T),
  self: This
) {
  return typeIs(valueOrGetter, 'function') ? valueOrGetter(self) : valueOrGetter
}
