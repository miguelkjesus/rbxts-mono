import { InstanceComponent } from 'generated/components'
import { PropertyWithTypeDecorator } from 'type-utils'

export function Attribute<This extends InstanceComponent>(attribute: string) {
  const decorator: PropertyWithTypeDecorator<AttributeValue, This> = (
    target,
    name
  ) => {
    target.Awaking.Once(() => {
      rawset(target, name, target.Instance.GetAttribute(attribute))
    })
  }

  return decorator
}
