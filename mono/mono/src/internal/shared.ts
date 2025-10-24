import { NonAbstractComponent } from 'component'

declare let shared: {
  __Mono__typeInstanceComponents: Map<
    typeof NonAbstractComponent,
    Map<RBXObject, NonAbstractComponent>
  >
  __Mono__registeredTags: Set<string>
}

shared.__Mono__typeInstanceComponents ??= new Map()
shared.__Mono__registeredTags ??= new Set()

export function getTypeInstanceComponents() {
  return shared.__Mono__typeInstanceComponents
}

export function getRegisteredTags() {
  return shared.__Mono__registeredTags
}
