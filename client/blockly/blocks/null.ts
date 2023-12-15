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
    "output": null,
    "colour": 230,
    "tooltip": "啊，没有提示",
    "helpUrl": ""

}
export function blockly_null_Generator(block){
  let text_name = block.getFieldValue('NAME');
  let code = `${text_name}\n`;
  return code;
};