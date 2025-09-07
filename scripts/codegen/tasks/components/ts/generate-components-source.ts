import { ApiClass } from "../../../helpers/api-dump";
import isClassAllowed from "../../../helpers/class-blacklist";
import generateSource from "../../../helpers/ts/generate-source";
import importDependencies from "../../../helpers/ts/import";
import createComponentClass from "./create-component-class-declaration";

function generateComponentsSource(Classes: ApiClass[]) {
  return generateSource([
    importDependencies(["SignalParameters"], "types"),
    importDependencies(["Component"], "component"),
    ...Classes.filter(isClassAllowed).map(createComponentClass)
  ])
}

export default generateComponentsSource
