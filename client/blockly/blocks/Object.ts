import { javascriptGenerator } from "blockly/javascript";
import * as Blockly from "blockly";
export const ObjectBlock = {
  "type": "Object",
  "message0": "{ %1 %2 }",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "action"
    }
  ],
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function ObjectBlockGenerator(block) {
  const statementMembers = javascriptGenerator.statementToCode(block, 'action');
  const code = `{\n${statementMembers}\n}`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

export const KeysBlock = {
  "type": "Keys",
  "message0": "%1 : %2",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME1",
      "text": "键"
    },
    {
      "type": "input_value",
      "name": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function KeysBlockGenerator(block) {
  let dropdown_name = block.getFieldValue('NAME1')
  let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  let code = `"${dropdown_name}"\:${value_name},\n`;
  return code;
};

export const textjsonBlock = {
  "type": "text_json",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "NAME1",
      "options": [
        [
          "文本转换为json对象",
          "parse"
        ],
        [
          "json对象转换为文本",
          "stringify"
        ]
      ]
    },
    {
      "type": "input_value",
      "name": "NAME"
    }
  ],
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function textjsonBlockGenerator(block) {
  let dropdown_name = block.getFieldValue('NAME1')
  let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  let code = `JSON.${dropdown_name}(${value_name})\n`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

export const ObjectBlocks = [
  ObjectBlock,
  KeysBlock,
  textjsonBlock
];

export const ObjectBlockGenerators = {
  'Object': ObjectBlockGenerator,
  'Keys': KeysBlockGenerator,
  'text_json': textjsonBlockGenerator
};
