import { javascriptGenerator } from "blockly/javascript";

export const blockly_null = {

  "type": "null",
  "message0": "%1",
  "args0": [
    {
      "type": "field_multilinetext",
      "name": "NAME",
      "text": "空白"
    }
  ],
  "colour": 230,

  "tooltip": "啊，没有提示",
  "helpUrl": ""

}

export function blockly_nullBlockGenerator(block) {
  let text_name = block.getFieldValue('NAME');
  let code = `${text_name};\n`;
  return code;
};

export const blockly_null1 = {

  "type": "null1",
  "message0": "%1",
  "args0": [
    {
      "type": "field_multilinetext",
      "name": "NAME",
      "text": "空白"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "啊，没有提示",
  "helpUrl": ""

}

export function blockly_null1BlockGenerator(block) {
  let text_name = block.getFieldValue('NAME');
  let code = `${text_name};\n`;
  return code;
};

export const blockly_null2 = {

  "type": "null2",
  "message0": "%1",
  "args0": [
    {
      "type": "field_multilinetext",
      "name": "NAME",
      "text": "空白"
    },
  ],
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""

}

export function blockly_null2BlockGenerator(block) {
  let text_name = block.getFieldValue('NAME');
  let code = `${text_name}`;
  return [code, javascriptGenerator.ORDER_NONE];
};

export const blockly_null3 = {

  "type": "null3",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "field_multilinetext",
      "name": "NAME",
      "text": "空白"
    },
    {
      "type": "input_value",
      "name": "PARAM"
    }
  ],
  "output": null,
  "colour": 230,
  "tooltip": "带参数输入的空白块",
  "helpUrl": ""

}

export function blockly_null3BlockGenerator(block) {
  let text_name = block.getFieldValue('NAME');
  let value_param = javascriptGenerator.valueToCode(block, 'PARAM', javascriptGenerator.ORDER_ATOMIC);
  let code = `${text_name}(${value_param})`;
  return [code, javascriptGenerator.ORDER_NONE];
};

export const nullBlocks = [
  blockly_null,
  blockly_null1,
  blockly_null2,
  blockly_null3
]

export const nullBlockGenerators = {
  'null': blockly_nullBlockGenerator,
  'null1': blockly_null1BlockGenerator,
  'null2': blockly_null2BlockGenerator,
  'null3': blockly_null3BlockGenerator
}
