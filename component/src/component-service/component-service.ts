import { BaseComponent, BasePartComponent } from "generated/components";

const types = new Set<typeof BaseComponent>();

export function GetComponentTypes(): readonly typeof BaseComponent[] {
  return [...types];
}

export function Register(componentType: typeof BaseComponent) {
  types.add(componentType);
}

export function Unregister(componentType: typeof BaseComponent) {
  types.delete(componentType);
}
