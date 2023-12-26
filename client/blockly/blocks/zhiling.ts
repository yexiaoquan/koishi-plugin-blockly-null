import {javascriptGenerator} from "blockly/javascript";
export const zhiling = {
    "type": "zhiling",
    "message0": "调用指令%1",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME"
      }
    ],
    "output": null,
    "colour": 230,
    "tooltip": "调用指令并返回结果",
    "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function zhilingBlockGenerator(block) {
let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
let code = `session.execute(${value_name})`;
return [code,javascriptGenerator.ORDER_NONE];
};

export const zhilingBlocks = [
    zhiling

]
  
export const zhilingBlockGenerators = {
    'zhiling':zhilingBlockGenerator
}