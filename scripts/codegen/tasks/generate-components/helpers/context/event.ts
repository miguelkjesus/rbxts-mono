import { ApiEvent } from '../api-dump'
import RobloxData from '../roblox-data'
import transformHtml from '../transform-html'

import type CodegenComponent from './component'

export default class CodegenEvent {
  readonly EventName: string
  readonly MethodName: string
  readonly Component: CodegenComponent
  readonly Documentation?: string

  constructor(Data: RobloxData, Component: CodegenComponent, Event: ApiEvent) {
    this.Component = Component
    this.EventName = Event.Name
    this.MethodName = Event.Name.startsWith('On')
      ? Event.Name
      : `On${Event.Name}`

    const Docs = Data.getPropertyDocs(Component.ClassName, Event.Name)

    if (Docs?.documentation) {
      this.Documentation = transformHtml(Docs.documentation)
    }
  }
}
