import ts, { factory } from 'typescript'

import { ApiClass, ApiEvent } from '../helpers/api-dump'
import {
  INSTANCE_TYPE_ARGS,
  SUPERCLASS_TYPE_ARGS,
  TYPE_PARAMS,
  TypeParameter,
} from '../helpers/generics'
import RobloxData from '../helpers/roblox-data'
import transformHtml from '../helpers/transform-html'
import isEventAllowed from '../helpers/event-blacklist'

import CodegenEvent from './event'

const CLASS_ALIASES: Record<string, string> = { Object: 'RBXObject' }
const getTypescriptName = (name: string) => CLASS_ALIASES[name] ?? name

export default class CodegenComponent {
  readonly ClassName: string
  readonly ComponentName: string
  readonly TypeParameters?: TypeParameter[]
  readonly ClassType: ts.TypeNode
  readonly StaticClassType: ts.TypeNode
  readonly SuperClassComponentName: string
  readonly SuperClassTypeArguments?: ts.TypeNode[]
  readonly Events: CodegenEvent[]

  readonly Documentation?: string

  constructor(Data: RobloxData, Class: ApiClass) {
    this.ClassName = Class.Name
    const TypescriptName = getTypescriptName(Class.Name)
    this.ComponentName = `${TypescriptName}Component`

    // Generics
    this.TypeParameters = TYPE_PARAMS[Class.Name]
    this.SuperClassTypeArguments = SUPERCLASS_TYPE_ARGS[Class.Name]
    const InstanceTypeArguments = INSTANCE_TYPE_ARGS[Class.Name]

    this.ClassType = factory.createTypeReferenceNode(
      factory.createIdentifier(TypescriptName),
      InstanceTypeArguments
    )
    this.StaticClassType = factory.createTypeReferenceNode(
      factory.createIdentifier(TypescriptName),
      InstanceTypeArguments
        ? InstanceTypeArguments.map(() =>
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
