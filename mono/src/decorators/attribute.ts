import { InstanceComponent } from 'generated/components'
import { PropertyDecorator } from 'types'

export function Attribute(attribute: string) {
  const decorator: PropertyDecorator<InstanceComponent> = (target, name) => {
    target.Starting.Once(() => {
      rawset(target, name, target.Instance.GetAttribute(attribute))
    })
  }

  return decorator
}
