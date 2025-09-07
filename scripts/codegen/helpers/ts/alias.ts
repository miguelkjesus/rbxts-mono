const CLASS_ALIAS_MAP = new Map([["Object", "RBXObject"]]);

export function getSafeClassName(name: string) {
	return CLASS_ALIAS_MAP.get(name) ?? name;
}

const PARAMETER_ALIAS_MAP = new Map([
	["function", "callback"],
	["debugger", "debug"],
	["old", "oldValue"],
	["new", "newValue"],
]);

export function getSafeParameterName(name: string) {
	return PARAMETER_ALIAS_MAP.get(name) ?? name;
}

const EVENT_ALIAS_MAP = new Map<string, string>()

export function getSafeEventName(name: string) {
	return EVENT_ALIAS_MAP.get(name) ?? name;
}

export function getSafeHookName(name: string) {
	const eventName = getSafeEventName(name);
	return eventName.startsWith("On")
		? eventName
		: `On${eventName}`;
}
