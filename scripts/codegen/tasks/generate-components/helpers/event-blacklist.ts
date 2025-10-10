import { ApiClass, ApiEvent } from './api-dump'

const EVENT_BLACKLIST = new Map([
  ['Object', ['Changed']],
  ['Instance', ['Destroying']], // Destroy event is already defined and handled in component
])

function isEventAllowed(Class: ApiClass, Event: ApiEvent) {
  return (
    Event.Security === 'None' &&
    !Event.Tags?.includes('Deprecated') &&
    !EVENT_BLACKLIST.get(Class.Name)?.includes(Event.Name)
  )
}

export default isEventAllowed
