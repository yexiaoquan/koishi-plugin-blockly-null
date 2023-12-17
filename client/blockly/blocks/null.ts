import {javascriptGenerator} from "blockly/javascript";

export const blockly_null = {

    "type": "null",
    "message0": "%1",
    "args0": [
      {
        "type": "field_input",
        "name": "NAME",
        "text": "空白"
      }
    ],
    "colour": 230,
    "tooltip": "啊，没有提示",
    "helpUrl": ""

}

export function blockly_nullBlockGenerator(block){
  let text_name = block.getFieldValue('NAME');
  let code = `${text_name}\n;`;
  return code;
};

export const blockly_null1 = {

  "type": "null1",
  "message0": "%1",
  "args0": [
    {
      "type": "field_input",
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
  let code = `${text_name}\n;`;
  return code;
};

export const blockly_null2 = {
  
    "type": "null2",
    "message0": "%1",
    "args0": [
      {
        "type": "field_input",
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
  return [code,javascriptGenerator.ORDER_NONE];
};

export const nullBlocks = [
  blockly_null,
  blockly_null1,
  blockly_null2
]

export const nullBlockGenerators = {
  'null':blockly_nullBlockGenerator,
  'null1':blockly_null1BlockGenerator,
  'null2':blockly_null2BlockGenerator
}
