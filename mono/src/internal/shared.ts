import { NonAbstractComponent } from 'component'

declare let shared: {
  __Mono__typeInstanceComponents: Map<
    typeof NonAbstractComponent,
    Map<RBXObject, NonAbstractComponent>
  >
}

shared.__Mono__typeInstanceComponents ??= new Map()

export function getTypeInstanceComponents() {
  return shared.__Mono__typeInstanceComponents
}
