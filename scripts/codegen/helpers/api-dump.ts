async function getApiDump(): Promise<ApiDump> {
  return (await fetch(
    "https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/refs/heads/roblox/Mini-API-Dump.json"
  )).json()
}

export interface ApiParameter {
	Name: string;
	Type: ApiValueType;
	Default?: string;
}

export type SecurityType =
	| "None"
	| "LocalUserSecurity"
	| "PluginSecurity"
	| "RobloxScriptSecurity"
	| "RobloxSecurity"
	| "NotAccessibleSecurity";

export type ThreadSafety = "Unsafe" | "Safe" | "Unknown";
export type PropertyThreadSafety = ThreadSafety | "ReadSafe";

export type MemberCategoryType =
	| "instance/object"
	| "animation/instance"
	| "instance/mesh"
	| "render/decal"
	| "instance/gui"
	| "physics/joint"
	| "lua/script"
	| "instance/part"
	| "sound/default";

export type CategoryType =
	| "Appearance"
	| "Attachments"
	| "Behavior"
	| "Camera"
	| "Compliance"
	| "Data"
	| "Derived Data"
	| "Goals"
	| "Image"
	| "Shape"
	| "Thrust"
	| "Turn";

export type DeprecatedTagMetadata = { PreferredDescriptorName: string; ThreadSafety: ThreadSafety };

export type ClassTag =
	| "Deprecated"
	| DeprecatedTagMetadata
	| "NotBrowsable"
	| "NotCreatable"
	| "NotReplicated"
	| "PlayerReplicated"
	| "Service"
	| "Settings";

export type MemberTag =
	| "CanYield"
	| "CustomLuaState"
	| "Deprecated"
	| DeprecatedTagMetadata
	| "Hidden"
	| "NotBrowsable"
	| "NotReplicated"
	| "NotScriptable"
	| "ReadOnly"
	| "Yields";

interface ApiMemberBase {
	MemberType: string;
	Name: string;
	Tags?: Array<MemberTag>;
	Description?: string;
}

export interface ApiValueType {
	Category: "Primitive" | "Class" | "DataType" | "Enum" | "Group";
	Name: string;
}

export interface ApiProperty extends ApiMemberBase {
	MemberType: "Property";
	Category: CategoryType;
	Serialization: {
		CanLoad: boolean;
		CanSave: boolean;
	};
	Security: {
		Read: SecurityType;
		Write: SecurityType;
	};
	ThreadSafety: PropertyThreadSafety;
	ValueType: ApiValueType;
}

export interface ApiFunction extends ApiMemberBase {
	MemberType: "Function";
	Parameters: Array<ApiParameter>;
	ReturnType: ApiValueType | Array<ApiValueType>;
	Security: SecurityType;
	ThreadSafety: ThreadSafety;
}

export interface ApiEvent extends ApiMemberBase {
	MemberType: "Event";
	Parameters: Array<ApiParameter>;
	Security: SecurityType;
	ThreadSafety: ThreadSafety;
}

export interface ApiCallback extends ApiMemberBase {
	MemberType: "Callback";
	Parameters: Array<ApiParameter>;
	ReturnType: ApiValueType;
	Security: SecurityType;
	ThreadSafety: ThreadSafety;
}

export type ApiMember = ApiProperty | ApiFunction | ApiEvent | ApiCallback;

export interface ApiClass {
	Members: Array<ApiMember>;
	MemoryCategory: MemberCategoryType;
	Tags?: Array<ClassTag>;
	Name: string;
	Superclass: string;
	Subclasses: Array<string>;
	Description?: string;
}

export interface ApiEnumItem {
	LegacyNames?: Array<string>;
	Name: string;
	Value: number;
}

export interface ApiEnum {
	Items: Array<ApiEnumItem>;
	Name: string;
}

export interface ApiDump {
	Classes: Array<ApiClass>;
	Enums: Array<ApiEnum>;
	Version: number;
}

export default getApiDump
