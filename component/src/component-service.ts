import { ComponentInstance, NonAbstractComponent } from "component";

const CollectionService = game.GetService("CollectionService")

export namespace ComponentService {
  const typeInstanceComponents = new Map<typeof NonAbstractComponent, Map<RBXObject, NonAbstractComponent>>();

  const ComponentAddedEvent: BindableEvent<(component: NonAbstractComponent) => void> = new Instance("BindableEvent");
  export const ComponentAdded = ComponentAddedEvent.Event;

  export function GetComponentTypes(): readonly typeof NonAbstractComponent[] {
    return [...typeInstanceComponents].map(([ComponentType]) => ComponentType);
  }

  export function RegisterType<T extends typeof NonAbstractComponent>(
    ComponentType: T
  ) {
    typeInstanceComponents.set(ComponentType, new Map())
    return ComponentType
  }

  function GenericGetInstanceComponents(ComponentType: typeof NonAbstractComponent) {
    const instanceComponents = typeInstanceComponents.get(ComponentType)
    if (instanceComponents !== undefined) {
      return instanceComponents
    } else {
      RegisterType(ComponentType)
      return typeInstanceComponents.get(ComponentType)!
    }
  }

  export function GetInstanceComponents<T extends typeof NonAbstractComponent>(
    ComponentType: T
  ) {
    return GenericGetInstanceComponents(ComponentType) as unknown as ReadonlyMap<ComponentInstance<InstanceType<T>>, InstanceType<T>>
  }

  export function GetInstances<T extends typeof NonAbstractComponent>(
    ComponentType: T
  ) {
    return [...GetInstanceComponents(ComponentType)].map(([instance, _]) => instance)
  }

  export function GetComponents<T extends typeof NonAbstractComponent>(
    ComponentType: T
  ) {
    return [...GetInstanceComponents(ComponentType)].map(([_, component]) => component)
  }

  export function CanAddComponent<T extends typeof NonAbstractComponent>(
    ComponentType: T,
    instance: RBXObject
  ): instance is ComponentInstance<InstanceType<T>> {
    return ComponentType.IsClass(instance) && !GenericGetInstanceComponents(ComponentType).has(instance)
  }

  export function AddComponent<T extends typeof NonAbstractComponent>(
    ComponentType: T,
    instance: RBXObject
  ) {
    if (CanAddComponent(ComponentType, instance)) {
      const component = new ComponentType(instance)
      GenericGetInstanceComponents(ComponentType).set(instance, component)
      ComponentAddedEvent.Fire(component);
      return component as InstanceType<T>
    }
  }

  export function GetComponent<T extends typeof NonAbstractComponent>(
    ComponentType: T,
    instance: RBXObject
  ) {
    return GenericGetInstanceComponents(ComponentType).get(instance) as InstanceType<T> | undefined
  }

  export function RemoveComponent<T extends typeof NonAbstractComponent>(
    ComponentType: T,
    instance: RBXObject
  ) {
    const component = GetComponent(ComponentType, instance)
    if (!component) return false

    component.Destroy()
    GenericGetInstanceComponents(ComponentType).delete(instance)
    return true
  }

  export function Tag(tag: string) {
    return function <T extends typeof NonAbstractComponent>(ComponentType: T) {
      for (const instance of CollectionService.GetTagged(tag)) {
        AddComponent(ComponentType, instance)
      }

      CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
        AddComponent(ComponentType, instance)
      })

      CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
        RemoveComponent(ComponentType, instance)
      })

      ComponentAdded.Connect((component) => {
        const { Instance } = component
        if (component instanceof ComponentType && Instance.IsA("Instance")) {
          CollectionService.AddTag(Instance, tag)
        }
      })
    }
  }
}

export const Tag = ComponentService.Tag
