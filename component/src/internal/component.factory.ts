import { Component } from "component";
// @remove start

declare const __ClassName_StringLiteral__: keyof Objects;
type __Type__ = RBXObject;

// @remove end
export class __ComponentName__ extends Component<__Type__> {
  static readonly ClassName = __ClassName_StringLiteral__;
  private static readonly InstanceComponentMap = new Map<__Type__, __ComponentName__>();

  private static Create(instance: __Type__) {
    const component = new this(instance);
    this.InstanceComponentMap.set(instance, component);
    return component;
  }

  static GetInstanceComponentMap() {
    return this.InstanceComponentMap;
  }

  static GetInstances() {
    return [...this.InstanceComponentMap].map(([instance, _]) => instance)
  }

  static GetComponents() {
    return [...this.InstanceComponentMap].map(([_, component]) => component)
  }

  private static IsClass(instance: RBXObject): instance is __Type__ {
    return instance.IsA(this.ClassName);
  }

  static CanAdd(instance: RBXObject) {
    return this.IsClass(instance);
  }

  static TryAdd(instance: RBXObject) {
    if (this.CanAdd(instance)) {
      return this.Create(instance)
    }
  }

  static Add(instance: __Type__) {
    const component = this.TryAdd(instance)

    if (component === undefined) {
      error(`Cannot add a '${this.ClassName}' component to a '${instance.ClassName}'`)
    }

    return component
  }

  static TryGet(instance: RBXObject) {
    if (!this.IsClass(instance)) return;
    return this.InstanceComponentMap.get(instance);
  }

  static Get(instance: __Type__) {
    const component = this.TryGet(instance);

    if (component === undefined) {
      error(`Instance does not have a '${this.ClassName}' component`)
    }

    return component
  }

  static Remove(instance: RBXObject) {
    const component = this.TryGet(instance);

    if (component === undefined) {
      return false;
    } else {
      component.Destroy()
      this.InstanceComponentMap.delete(instance as __Type__)
      return true;
    }
  }
}
