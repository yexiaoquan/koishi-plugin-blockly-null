import {javascriptGenerator} from "blockly/javascript";

export const at_id = {
  "type": "at_id",
  "message0": "解析消息，获取第一个@的id",
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function at_idBlockGenerator(block){
  let code = `session.elements.filter((element) => element.type == 'at')?.[0].attrs.id`;
  return [code,javascriptGenerator.ORDER_NONE];
}

export const at_name = {
  "type": "at_name",
  "message0": "解析消息，获取第一个@的昵称",
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}
  
export function at_nameBlockGenerator(block){
  let code = `session.elements.filter((element) => element.type == 'at')?.[0].attrs.name`;
  return [code,javascriptGenerator.ORDER_NONE];
}

export const atBlocks = [
  at_id,
  at_name
]
    
export const atBlockGenerators = {
  'at_id':at_idBlockGenerator,
  'at_name':at_nameBlockGenerator
}