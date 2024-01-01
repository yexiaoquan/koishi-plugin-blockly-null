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

export const MD5 = {
  "type": "MD5",
  "message0": "MD5加密 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
    }
  ],
  "output": null,
  "template":['MD5'],
  "colour": 225,
  "tooltip": "",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function MD5BlockGenerator(block) {
  let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  let code = `x_MD5${value_name}`;
  return [code,javascriptGenerator.ORDER_NONE]; 
}

export const toString = {
    "type": "toString",
    "message0": "转换为 %1 编码 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "base64",
            "base64"
          ],
          [
            "utf8",
            "utf8"
          ],
          [
            "ascii",
            "ascii"
          ],
          [
            "latin1",
            "latin1"
          ],
          [
            "hex",
            "hex"
          ]
        ]
      },
      {
        "type": "input_value",
        "name": "NAME1"
      }
    ],
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function toStringBlockGenerator(block) {
  let dropdown_name = block.getFieldValue('NAME')
  let value_name = javascriptGenerator.valueToCode(block, 'NAME1', javascriptGenerator.ORDER_ATOMIC)
  let code = `${value_name}.toString('${dropdown_name}')`;
  return [code,javascriptGenerator.ORDER_NONE]; 
}

export const fetchDataFromUrl = {
  "type": "fetchDataFromUrl",
  "message0": "文件读取 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME1",
    }
  ],
  "output": null,
  "template":['fetchDataFromUrl'],
  "colour": 225,
  "tooltip": "读取文件，支持http/https/file协议",
  "helpUrl": "https://forum.koishi.xyz/t/topic/6245"
}

export function fetchDataFromUrlBlockGenerator(block) {
  let value_name = javascriptGenerator.valueToCode(block, 'NAME1', javascriptGenerator.ORDER_ATOMIC)
  let code = `await fetchDataFromUrl(${value_name})`;
  return [code,javascriptGenerator.ORDER_NONE]; 
}

export const testBlocks = [
    test,
    MD5,
    toString,
    fetchDataFromUrl
]


export const testBlockGenerators = {
    'test':pptr_htmlBlockGenerator,
    'MD5':MD5BlockGenerator,
    'toString':toStringBlockGenerator,
    'fetchDataFromUrl':fetchDataFromUrlBlockGenerator
}
  