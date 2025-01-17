import { javascriptGenerator } from "blockly/javascript";
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
  "imports": { 'koishi-plugin-puppeteer': [] },
  "injects": ["puppeteer"],
  "template": ["pptr"],
  "colour": 230,
  "tooltip": "",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6244"
}

export function pptr_htmlBlockGenerator(block) {
  let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  let code = `await ctx.puppeteer.render (${value_name})`;
  return [code, javascriptGenerator.ORDER_NONE];
};

export const pptrBlocks = [
  pptr_html

]

export const pptrBlockGenerators = {
  'pptr': pptr_htmlBlockGenerator
}
