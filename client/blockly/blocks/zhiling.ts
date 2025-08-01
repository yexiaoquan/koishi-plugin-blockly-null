import { javascriptGenerator } from "blockly/javascript";
export const zhiling = {
  "type": "zhiling",
  "message0": "调用指令%1 获取返回元素%2",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME"
    },
    {
      "type": "field_dropdown",
      "name": "RETURN_ELEMENT",
      "options": [
        ["否", "false"],
        ["是", "true"]
      ]
    }
  ],
  "output": null,
  "colour": 230,
  "tooltip": "调用指令，可选择是否获取返回的元素",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function zhilingBlockGenerator(block) {
  let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  let return_element = block.getFieldValue('RETURN_ELEMENT')
  let code = `await session.execute(${value_name}, ${return_element})`;
  return [code, javascriptGenerator.ORDER_NONE];
};

export const zhilingBlocks = [
  zhiling

]

export const zhilingBlockGenerators = {
  'zhiling': zhilingBlockGenerator
}