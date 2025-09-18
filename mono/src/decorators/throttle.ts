import { runGetter } from 'internal/decorator-utils'
import { Throttler } from 'utils/throttler'
import { MethodDecorator } from 'type-utils'

export function Throttle<This extends object>(
  intervalOrGetter: number | ((self: This) => number)
) {
  const throttler = new Throttler()

  const decorator: MethodDecorator<
    (this: This, ...params: unknown[]) => void
  > = (_, __, descriptor) => {
    return {
      value: (target, ...params) => {
        const interval = runGetter(intervalOrGetter, target)

        if (!throttler.Ready(interval)) {
          descriptor.value(target, ...params)
        }
      },
    }
  }

  return decorator
}
