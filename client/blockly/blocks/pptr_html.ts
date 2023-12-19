import {javascriptGenerator} from "blockly/javascript";
export const pptr_html = {
    "type": "pptr",
    "message0": "渲染html %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME"
      }
    ],
    "output": null,
    "imports":{'koishi-plugin-puppeteer':[]},
    "injects":{required: ["puppeteer"]},//奋斗结下的不一定是果实，也许是报错
    "template":["pptr"],
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
}

export function pptr_htmlBlockGenerator(block) {
let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
// TODO: Assemble javascript into code variable.
let code = `await ctx.puppeteer.render (${value_name})`;
// TODO: Change ORDER_NONE to the correct strength.
return [code,javascriptGenerator.ORDER_NONE];
};

export const pptrBlocks = [
    pptr_html

]
  
  export const pptrBlockGenerators = {
    'pptr':pptr_htmlBlockGenerator
}
  