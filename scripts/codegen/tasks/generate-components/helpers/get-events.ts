import { ApiClass, ApiEvent } from './api-dump'
import isEventAllowed from './event-blacklist'

function getEvents(Class: ApiClass) {
  return Class.Members.filter(
    (Member): Member is ApiEvent => Member.MemberType === 'Event'
  ).filter((Event) => isEventAllowed(Class, Event))
}

export default getEvents
