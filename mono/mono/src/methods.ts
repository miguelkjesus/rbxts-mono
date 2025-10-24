import {
  ComponentInstance,
  ComponentProps,
  NonAbstractComponent,
} from 'component'
import { event } from 'internal/event-utils'
import { getTypeInstanceComponents } from 'internal/shared'

const ComponentAddedEvent = event<[component: NonAbstractComponent]>()
export const ComponentAdded = ComponentAddedEvent.Event

const ComponentRemovingEvent = event<[component: NonAbstractComponent]>()
export const ComponentRemoving = ComponentRemovingEvent.Event

export function GetComponentTypes(): readonly (typeof NonAbstractComponent)[] {
  return [...getTypeInstanceComponents()].map(
    ([ComponentType]) => ComponentType
  )
}

export function RegisterType<T extends typeof NonAbstractComponent>(
  ComponentType: T
) {
  getTypeInstanceComponents().set(ComponentType, new Map())
  return ComponentType
}

function GenericGetInstanceComponents(
  ComponentType: typeof NonAbstractComponent
) {
  const instanceComponents = getTypeInstanceComponents().get(ComponentType)
  if (instanceComponents !== undefined) {
    return instanceComponents
  } else {
    RegisterType(ComponentType)
    return getTypeInstanceComponents().get(ComponentType)!
  }
}

export function GetInstanceComponents<T extends typeof NonAbstractComponent>(
  ComponentType: T
) {
  return GenericGetInstanceComponents(ComponentType) as unknown as ReadonlyMap<
    ComponentInstance<InstanceType<T>>,
    InstanceType<T>
  >
}

export function GetInstances<T extends typeof NonAbstractComponent>(
  ComponentType: T
) {
  return [...GetInstanceComponents(ComponentType)].map(
    ([instance, _]) => instance
  )
}

export function GetComponents<T extends typeof NonAbstractComponent>(
  ComponentType: T
) {
  return [...GetInstanceComponents(ComponentType)].map(
    ([_, component]) => component
  )
}

export function CanAddComponent<T extends typeof NonAbstractComponent>(
  ComponentType: T,
  instance: RBXObject
): instance is ComponentInstance<InstanceType<T>> {
  return (
    ComponentType.IsClass(instance) &&
    !GenericGetInstanceComponents(ComponentType).has(instance)
  )
}

export function TryAddComponent<T extends typeof NonAbstractComponent>(
  ComponentType: T,
  instance: RBXObject,
  properties?: ComponentProps<InstanceType<T>>
) {
  if (CanAddComponent(ComponentType, instance)) {
    const component = new ComponentType(instance)

    if (properties !== undefined) {
      for (const [k, v] of pairs(properties)) {
        rawset(component, k, v)
      }
    }

    GenericGetInstanceComponents(ComponentType).set(instance, component)
    ComponentAddedEvent.Fire(component)
    return component as InstanceType<T>
  }
}

export function AddComponent<T extends typeof NonAbstractComponent>(
  ComponentType: T,
  instance: ComponentInstance<InstanceType<T>>,
  properties?: ComponentProps<InstanceType<T>>
) {
  const component = TryAddComponent(ComponentType, instance, properties)
  if (!component) error('Failed to add component') // TODO better error
  return component
}

export function GetComponent<T extends typeof NonAbstractComponent>(
  ComponentType: T,
  instance: RBXObject
) {
  return GenericGetInstanceComponents(ComponentType).get(instance) as
    | InstanceType<T>
    | undefined
}

export function RemoveComponent<T extends typeof NonAbstractComponent>(
  ComponentType: T,
  instance: RBXObject
) {
  const component = GetComponent(ComponentType, instance)
  if (!component) return false

  ComponentRemovingEvent.Fire(component)
  component.Destroy()
  GenericGetInstanceComponents(ComponentType).delete(instance)
  return true
}
