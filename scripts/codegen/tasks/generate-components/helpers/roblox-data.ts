import getApiDocs, { ApiDocs } from './api-docs'
import getApiDump, { ApiClass, ApiDump, ApiEvent } from './api-dump'
import isClassAllowed from './class-blacklist'
import isEventAllowed from './event-blacklist'

export default class RobloxData {
  readonly Docs: ApiDocs
  readonly Api: ApiDump

  constructor(docs: ApiDocs, api: ApiDump) {
    this.Docs = docs
    this.Api = api
  }

  static async fetch() {
    const [docs, api] = await Promise.all([getApiDocs(), getApiDump()])
    return new this(docs, api)
  }

  getClasses() {
    return this.Api.Classes.filter(isClassAllowed)
  }

  getClassDocs(className: string) {
    return this.Docs[`@roblox/globaltype/${className}`]
  }

  getPropertyDocs(className: string, memberName: string) {
    return this.Docs[`@roblox/globaltype/${className}.${memberName}`]
  }

  getEvents(Class: ApiClass) {
    return Class.Members.filter(
      (Member): Member is ApiEvent => Member.MemberType === 'Event'
    ).filter((Event) => isEventAllowed(Class, Event))
  }
}
