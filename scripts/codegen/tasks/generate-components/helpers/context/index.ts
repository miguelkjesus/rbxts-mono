import isClassAllowed from '../class-blacklist'
import RobloxData from '../roblox-data'

import CodegenComponent from './component'

export default class CodegenContext {
  readonly Classes: CodegenComponent[]

  constructor(Data: RobloxData) {
    this.Classes = Data.Api.Classes.filter(isClassAllowed).map(
      (Class) => new CodegenComponent(Data, Class)
    )
  }
}
