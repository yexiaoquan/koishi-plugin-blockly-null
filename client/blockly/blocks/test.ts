import {javascriptGenerator} from "blockly/javascript";

export const test = {
    "type": "test",
    "message0": "返回文件列表     输入路经 %1 文件后缀列表 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "WENJAN",
      },
      {
        "type": "input_value",
        "name": "NAME1",
      }
    ],
    "inputsInline": false,
    "output": null,
    "template":['test'],
    "colour": 225,
    "tooltip": "",
    "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function pptr_htmlBlockGenerator(block) {
    let value_name = javascriptGenerator.valueToCode(block, 'WENJAN', javascriptGenerator.ORDER_ATOMIC)
    let value_name1 = javascriptGenerator.valueToCode(block, 'NAME1', javascriptGenerator.ORDER_ATOMIC)
    let code = `getFiles(${value_name}, ${value_name1})`;
    return [code,javascriptGenerator.ORDER_NONE];
}

export const testBlocks = [
    test

]
  
export const testBlockGenerators = {
    'test':pptr_htmlBlockGenerator
}
  