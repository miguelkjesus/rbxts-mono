import ts, { factory } from 'typescript'

import { ApiClass, ApiEvent } from '../api-dump'
import RobloxData from '../roblox-data'
import transformHtml from '../transform-html'
import isEventAllowed from '../event-blacklist'

import CodegenEvent from './event'

const CLASS_ALIASES: Record<string, string> = { Object: 'RBXObject' }
const getTypescriptName = (name: string) => CLASS_ALIASES[name] ?? name

export type TypeParameter = {
  Name: string
  Default?: ts.TypeNode
}

const TYPE_PARAMS: Record<string, TypeParameter[]> = {
  ServiceProvider: [
    {
      Name: 'S',
      Default: factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
    },
  ],
}

const SUPERCLASS_TYPE_ARGS: Record<string, string[]> = {
  DataModel: ['Services'],
}

export default class CodegenComponent {
  readonly ClassName: string
  readonly ComponentName: string
  readonly TypeParameters?: TypeParameter[]
  readonly ClassType: ts.TypeNode
  readonly StaticClassType: ts.TypeNode
  readonly SuperClassComponentName: string
  readonly SuperClassTypeArguments?: string[]
  readonly Events: CodegenEvent[]

  readonly Documentation?: string

  constructor(Data: RobloxData, Class: ApiClass) {
    this.ClassName = Class.Name
    const TypescriptName = getTypescriptName(Class.Name)
    this.ComponentName = `${TypescriptName}Component`

    // Generics
    this.TypeParameters = TYPE_PARAMS[Class.Name]
    this.SuperClassTypeArguments = SUPERCLASS_TYPE_ARGS[Class.Name]

    this.ClassType = factory.createTypeReferenceNode(
      factory.createIdentifier(TypescriptName),
      this.TypeParameters
        ? this.TypeParameters.map(({ Name }) =>
            factory.createTypeReferenceNode(
              factory.createIdentifier(Name),
              undefined
            )
          )
        : undefined
    )
    this.StaticClassType = factory.createTypeReferenceNode(
      factory.createIdentifier(TypescriptName),
      this.TypeParameters
        ? this.TypeParameters.map(() =>
            factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
          )
        : undefined
    )

    // Superclass
    const SuperClassTypescriptName =
      Class.Superclass !== '<<<ROOT>>>'
        ? getTypescriptName(Class.Superclass)
        : ''
    this.SuperClassComponentName = `${SuperClassTypescriptName}Component`

    // Events
    this.Events = Class.Members.filter(
      (Member): Member is ApiEvent =>
        Member.MemberType === 'Event' && isEventAllowed(Class, Member)
    ).map((Event) => new CodegenEvent(Data, this, Event))

    // Docs
    const Docs = Data.getClassDocs(Class.Name)

    if (Docs?.documentation) {
      this.Documentation = transformHtml(Docs.documentation)
    }
  }
}
