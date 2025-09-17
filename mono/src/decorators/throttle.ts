import { runGetter } from 'internal/decorator-utils'
import { PropertyDecorator } from 'types'

export function Throttle<This extends object>(
  intervalOrGetter: number | ((self: This) => number)
) {
  let lastTime = os.clock()

  const decorator: PropertyDecorator<
    (this: This, ...params: unknown[]) => void
  > = (_, __, descriptor) => {
    return {
      value: (self, ...params) => {
        const interval = runGetter(intervalOrGetter, self)
        const now = os.clock()
        if (now - lastTime < interval) return
        lastTime = now

        descriptor.value(self, ...params)
      },
    }
  }

  return decorator
}
