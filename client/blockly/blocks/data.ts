import { javascriptGenerator } from "blockly/javascript";
import { BlockSvg } from "blockly";

export const HttpGetBlock = {
  "type": "http_get",
  "message0": "发送简单HTTP GET请求 %1 网址 %2 返回类型 %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "url"
    },
    {
      "type": "field_dropdown",
      "name": "response_type",
      "options": [
        [
          "默认类型",
          ""
        ],
        [
          "JSON对象类型",
          "json"
        ],
        [
          "文本类型",
          "text"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function httpGetBlockGenerator(block: BlockSvg) {
  let value_url = javascriptGenerator.valueToCode(block, 'url', javascriptGenerator.ORDER_ATOMIC);
  let response_type = block.getFieldValue('response_type');
  return [`await ctx.http.get(${value_url},{responseType:"${response_type}"})`, javascriptGenerator.ORDER_NONE];
}

export const HttpPostBlock = {
  "type": "http_post",
  "message0": "发送简单HTTP Post请求 %1 网址 %2 参数 %3 返回类型 %4",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "url"
    },
    {
      "type": "input_value",
      "name": "data"
    },
    {
      "type": "field_dropdown",
      "name": "response_type",
      "options": [
        [
          "默认类型",
          ""
        ],
        [
          "JSON对象类型",
          "json"
        ],
        [
          "文本类型",
          "text"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function httpPostBlockGenerator(block: BlockSvg) {
  let value_url = javascriptGenerator.valueToCode(block, 'url', javascriptGenerator.ORDER_ATOMIC);
  let value_data = javascriptGenerator.valueToCode(block, 'data', javascriptGenerator.ORDER_ATOMIC);
  let response_type = block.getFieldValue('response_type');
  return [`await ctx.http.post(${value_url},${value_data},{responseType:"${response_type}"})`, javascriptGenerator.ORDER_NONE];
}

export const JsonPathParseBlock = {
  "type": "json_path_parse",
  "message0": "解析JSON对象 %1 JSONPath %2",
  "args0": [
    {
      "type": "input_value",
      "name": "value"
    },
    {
      "type": "field_input",
      "name": "path",
      "text": "$"
    }
  ],
  "inputsInline": false,
  "imports": { 'jsonpath-plus': ['JSONPath as parseJson'] },
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function jsonPathBlockGenerator(block: BlockSvg) {
  let value_value = javascriptGenerator.valueToCode(block, 'value', javascriptGenerator.ORDER_ATOMIC);
  let text_path = block.getFieldValue('path');
  return [`await parseJson({path: "${text_path}", json: ${value_value}})`, javascriptGenerator.ORDER_NONE];
}

export const KeyValueWriteBlock = {
  "type": "key_value_write",
  "message0": "写入键值对 作用域ID %1 键 %2 值 %3",
  "args0": [
    {
      "type": "input_value",
      "name": "scope_id"
    },
    {
      "type": "input_value",
      "name": "key"
    },
    {
      "type": "input_value",
      "name": "value",
      "align": "RIGHT"
    }
  ],
  "template": ["key_value_initialize"],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function keyValueWriteBlockGenerator(block: BlockSvg) {
  let value_key = javascriptGenerator.valueToCode(block, 'key', javascriptGenerator.ORDER_ATOMIC);
  let value_value = javascriptGenerator.valueToCode(block, 'value', javascriptGenerator.ORDER_ATOMIC);
  let value_scope_id = javascriptGenerator.valueToCode(block, 'scope_id', javascriptGenerator.ORDER_ATOMIC);
  if (value_scope_id.length) {
    // For backwards compatibility only, remove this in 1.x
    value_scope_id += "+\".\"+"
  }
  return `await ctx.database.upsert('blockly_key_value',[{key:${value_scope_id}${value_key},value:${value_value}}],['key'])\n`;
}

export const KeyValueReadBlock = {
  "type": "key_value_read",
  "message0": "读取键值对 作用域ID %1 键 %2",
  "args0": [
    {
      "type": "input_value",
      "name": "scope_id"
    },
    {
      "type": "input_value",
      "name": "key"
    }
  ],
  "template": ["key_value_initialize"],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function keyValueReadBlockGenerator(block: BlockSvg) {
  let value_key = javascriptGenerator.valueToCode(block, 'key', javascriptGenerator.ORDER_ATOMIC);
  let value_scope_id = javascriptGenerator.valueToCode(block, 'scope_id', javascriptGenerator.ORDER_ATOMIC);
  if (value_scope_id.length) {
    // For backwards compatibility only, remove this in 1.x
    value_scope_id += "+\".\"+"
  }
  return [`(await ctx.database.get('blockly_key_value',{key:${value_scope_id}${value_key}}))[0]?.value`, javascriptGenerator.ORDER_NONE];
}


export const DataBlocks = [
  HttpGetBlock,
  JsonPathParseBlock,
  KeyValueWriteBlock,
  KeyValueReadBlock,
  HttpPostBlock
]

export const dataBlockGenerators = {
  'http_get': httpGetBlockGenerator,
  'json_path_parse': jsonPathBlockGenerator,
  'key_value_write': keyValueWriteBlockGenerator,
  'key_value_read': keyValueReadBlockGenerator,
  'http_post': httpPostBlockGenerator
}
