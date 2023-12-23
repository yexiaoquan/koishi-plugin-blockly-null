import {javascriptGenerator} from "blockly/javascript";

export const SendSessionMessageBlock = {
  "type": "send_session_message",
  "message0": "发送消息给事件发送者 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "content",
      "check": [
        "Boolean",
        "String"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function sendSessionMessageBlockGenerator(block){
  let value_name = javascriptGenerator.valueToCode(block, 'content', javascriptGenerator.ORDER_ATOMIC);
  return `await session.send(${value_name});\n`;
}
export const broadcastBlock = {
  
  "type": "broadcast",
  "message0": "广播 %1 群聊列表 %2 消息内容 %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "NAME"
    },
    {
      "type": "input_value",
      "name": "NAME1",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "发送广播消息到指定群聊",
  "helpUrl": ""
  
};

export function broadcastBlockGenerator(block){
  let value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
  let value_name1 = javascriptGenerator.valueToCode(block, 'NAME1', javascriptGenerator.ORDER_ATOMIC);
  return `await session.bot.broadcast(${value_name}, ${value_name1});\n`;
}

export const ReturnMessageBlock = {
  "type": "return_message",
  "message0": "终止后续逻辑并发送消息 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "content",
      "check": [
        "Boolean",
        "String"
      ]
    }
  ],
  "previousStatement": null,
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function returnMessageBlockGenerator(block){
  let value_name = javascriptGenerator.valueToCode(block, 'content', javascriptGenerator.ORDER_ATOMIC);
  return `return ${value_name};\n`;
}

export const MessageBlocks = [
  SendSessionMessageBlock,
  ReturnMessageBlock,
  broadcastBlock
]

export const messageBlocks = {
  'send_session_message':sendSessionMessageBlockGenerator,
  'return_message':returnMessageBlockGenerator,
  'broadcast':broadcastBlockGenerator
}
