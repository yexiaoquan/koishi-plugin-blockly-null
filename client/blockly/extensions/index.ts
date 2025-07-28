import { parameterListMutator } from "./parameter";
import { registerScopeExtensions } from "./scope";
import * as Blockly from "blockly";
import { typeMutatorExtension } from "./type";
import { registerSegmentParserMutator } from "./segment";

export function unregisterIfRegistered(name: string) {
  if (Blockly.Extensions.isRegistered(name)) {
    Blockly.Extensions.unregister(name)
  }
}

export function registerExtensions() {
  parameterListMutator();
  registerScopeExtensions()
  typeMutatorExtension()
  registerSegmentParserMutator()
}
