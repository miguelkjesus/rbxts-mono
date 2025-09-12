import { NonAbstractComponent } from 'component'
import { ComponentAdded, RemoveComponent, TryAddComponent } from 'methods'
import { MethodDecorator } from 'types'

const CollectionService = game.GetService('CollectionService')

export function On<Params extends unknown[]>(
  signal: RBXScriptSignal<(...args: Params) => void>
) {
  type Fn = (...args: Params) => void

  return function (
    target: InferThis<Fn>,
    _,
    descriptor: TypedPropertyDescriptor<Fn>
  ) {
    signal.Connect((...args: Params) => descriptor.value(target, ...args))
    return descriptor
  } as MethodDecorator<(...args: Params) => void>
}

export function Tag(tag: string) {
  return function <T extends typeof NonAbstractComponent>(ComponentType: T) {
    for (const instance of CollectionService.GetTagged(tag)) {
      TryAddComponent(ComponentType, instance)
    }

    CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
      TryAddComponent(ComponentType, instance)
    })

    CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
      RemoveComponent(ComponentType, instance)
    })

    ComponentAdded.Connect((component) => {
      const { Instance } = component
      if (component instanceof ComponentType && Instance.IsA('Instance')) {
        CollectionService.AddTag(Instance, tag)
      }
    })

    return ComponentType
  }
}
