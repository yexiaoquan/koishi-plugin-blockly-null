import { javascriptGenerator } from "blockly/javascript";

export const at_id = {
  "type": "at_id",
  "message0": "解析消息，获取第一个@的id",
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function at_idBlockGenerator(block) {
  let code = `session.elements.filter((element) => element.type == 'at')?.[0].attrs.id`;
  return [code, javascriptGenerator.ORDER_NONE];
}

export const at_name = {
  "type": "at_name",
  "message0": "解析消息，获取第一个@的昵称",
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function at_nameBlockGenerator(block) {
  let code = `session.elements.filter((element) => element.type == 'at')?.[0].attrs.name`;
  return [code, javascriptGenerator.ORDER_NONE];
}
export const group_name = {
  "type": "group_name",
  "message0": "获取群聊名称",
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function group_nameBlockGenerator(block) {
  let code = `session.event.guild.name`;
  return [code, javascriptGenerator.ORDER_NONE];
}
export const group_id = {
  "type": "group_id",
  "message0": "获取群聊id",
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function group_idBlockGenerator(block) {
  let code = `session.event.guild.id`;
  return [code, javascriptGenerator.ORDER_NONE];
}

export const atBlocks = [
  at_id,
  at_name,
  group_name,
  group_id
]

export const atBlockGenerators = {
  'at_id': at_idBlockGenerator,
  'at_name': at_nameBlockGenerator,
  'group_name': group_nameBlockGenerator,
  'group_id': group_idBlockGenerator
}