// type defs from https://github.com/roblox-ts/types/blob/master/src/types/ApiDocs.d.ts

export default async function getApiDocs(): Promise<ApiDocs> {
  return (
    await fetch(
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/refs/heads/roblox/api-docs/mini/en-us.json'
    )
  ).json()
}

export interface ApiDocsParam {
  name: string
  documentation: string
}

export interface ApiDocsEntry {
  documentation: string
  learn_more_link?: string
  code_sample?: string
  params?: Array<ApiDocsParam>
  returns?: Array<string>
}

export interface ApiDocs {
  [key: string]: ApiDocsEntry
}
