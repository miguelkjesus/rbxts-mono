import ts, { factory } from 'typescript'

// Helpers

export type TypeParameter = {
  Name: string
  Constraint?: ts.TypeNode
  Default?: ts.TypeNode
}

const unknown = factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
const boolean = factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
const string = factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
const number = factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)

const array = (elementType: ts.TypeNode) =>
  factory.createArrayTypeNode(elementType)

const typeReference = (name: string, typeArgs?: ts.TypeNode[]) =>
  factory.createTypeReferenceNode(factory.createIdentifier(name), typeArgs)

const typeObject = (object: Record<string, ts.TypeNode>) =>
  factory.createTypeLiteralNode([
    ...Object.entries(object).map(([key, value]) =>
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier(key),
        undefined,
        value
      )
    ),
  ])

const UnknownArrayParam = (name = 'T'): TypeParameter => ({
  Name: name,
  Constraint: array(unknown),
  Default: array(unknown),
})

const UnknownParam = (name = 'T'): TypeParameter => ({
  Name: name,
  Default: factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
})

const callbackWithArgs = (argsType: ts.TypeNode) =>
  factory.createFunctionTypeNode(
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        factory.createToken(ts.SyntaxKind.DotDotDotToken),
        factory.createIdentifier('args'),
        undefined,
        argsType,
        undefined
      ),
    ],
    factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
  )

// CONSTANTS

export const TYPE_PARAMS: Record<string, TypeParameter[]> = {
  RemoteEvent: [UnknownArrayParam('Params')],
  UnreliableRemoteEvent: [UnknownArrayParam('Params')],
  RemoteFunction: [UnknownArrayParam('Params')],
  BindableEvent: [UnknownArrayParam('Params')],
  BindableFunction: [UnknownArrayParam('Params')],

  Pages: [UnknownParam('T')],
  InventoryPages: [UnknownParam('T')],
  StandardPages: [UnknownParam('T')],
  ServiceProvider: [UnknownParam('S')],
  GenericSettings: [UnknownParam('S')],
}

export const INSTANCE_TYPE_ARGS: Record<string, ts.TypeNode[]> = {
  RemoteEvent: [callbackWithArgs(typeReference('Params'))],
  UnreliableRemoteEvent: [callbackWithArgs(typeReference('Params'))],
  RemoteFunction: [callbackWithArgs(typeReference('Params'))],
  BindableEvent: [callbackWithArgs(typeReference('Params'))],
  BindableFunction: [callbackWithArgs(typeReference('Params'))],

  Pages: [typeReference('T')],
  InventoryPages: [typeReference('T')],
  StandardPages: [typeReference('T')],
  ServiceProvider: [typeReference('S')],
  GenericSettings: [typeReference('S')],
}

export const SUPERCLASS_TYPE_ARGS: Record<string, ts.TypeNode[]> = {
  CatalogPages: [typeReference('SearchCatalogResult')],
  DataStorePages: [
    typeObject({
      key: string,
      value: unknown,
    }),
  ],
  DataStoreVersionPages: [typeReference('DataStoreObjectVersionInfo')],
  FriendPages: [
    typeObject({
      AvatarFinal: boolean,
      AvatarUri: string,
      Id: number,
      Username: string,
      IsOnline: boolean,
    }),
  ],
  InventoryPages: [typeReference('T')],
  OutfitPages: [
    typeReference('ReadonlyArray', [
      typeObject({
        Id: number,
        Name: string,
        IsEditable: boolean,
      }),
    ]),
  ],
  StandardPages: [typeReference('T')],
  DataModel: [typeReference('Services')],
  GenericSettings: [typeReference('S')],
  UserSettings: [
    typeObject({ UserGameSettings: typeReference('UserGameSettings') }),
  ],
}
