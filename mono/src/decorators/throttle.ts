import { runGetter } from 'internal/decorator-utils'
import { MethodDecorator } from 'types'

export function Throttle<This extends object>(
  intervalOrGetter: number | ((self: This) => number)
) {
  let lastTime = os.clock()

  const decorator: MethodDecorator<
    (this: This, ...params: unknown[]) => void
  > = (_, __, descriptor) => {
    return {
      value: (target, ...params) => {
        const interval = runGetter(intervalOrGetter, target)
        const now = os.clock()
        if (now - lastTime < interval) return
        lastTime = now

        descriptor.value(target, ...params)
      },
    }
  }

  return decorator
}
