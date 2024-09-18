import {javascriptGenerator} from "blockly/javascript";
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
        "name": "action",
        "check": "key"
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
  "type": "keys",
  "message0": "%1 : %2",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "default"
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
    let text_1 = block.getFieldValue('1');
    let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
    let code = `${text_1}:${value_name},\n`;
    return [code,javascriptGenerator.ORDER_ATOMIC];
};


export const ObjectBlocks = [
    ObjectBlock,
    KeysBlock
];
  
export const ObjectBlockGenerators = {
    'Object':ObjectBlockGenerator,
    'Keys':KeysBlockGenerator,

};
