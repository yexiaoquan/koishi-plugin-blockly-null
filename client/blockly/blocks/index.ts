
import { DataBlocks, dataBlockGenerators } from "./data";
import { ParameterBlocks } from "./parameter";
import { SessionBlocks, sessionBlockGenerators } from "./session";
import { botBlockGenerators, BotBlocks } from "./bot";
import { debugBlockGenerators, DebugBlocks } from "./debugging";
import { eventBlockGenerators, EventBlocks } from "./event";
import { environmentBlockGenerators, EnvironmentBlocks } from "./environment";
import { textBlockGenerators, TextBlocks } from "./text";
import { logicalBlocks, LogicalBlocks } from "./logic";
import { messageBlocks, MessageBlocks } from "./message";
import { segmentBlockGenerators, SegmentBlocks } from "./segment";
import { numberBlockGenerators, NumberBlocks } from "./number";
import { TypeBlocks } from "./typing";
import { nullBlockGenerators, nullBlocks } from "./null";
import { importBlockGenerators, importBlocks } from "./import";
import { atBlockGenerators, atBlocks } from "./at";
import { pptrBlockGenerators, pptrBlocks } from "./pptr_html";
import { testBlockGenerators, testBlocks } from "./test";
import { zhilingBlockGenerators, zhilingBlocks } from "./zhiling";
import { ObjectBlockGenerators, ObjectBlocks } from "./Object";

export const Blocks = [
  ...LogicalBlocks,
  ...TextBlocks,
  ...EventBlocks,
  ...SessionBlocks,
  ...MessageBlocks,
  ...SegmentBlocks,
  ...DataBlocks,
  ...BotBlocks,
  ...DebugBlocks,
  ...EnvironmentBlocks,
  ...ParameterBlocks,
  ...NumberBlocks,
  ...TypeBlocks,
  ...nullBlocks,
  ...importBlocks,
  ...atBlocks,
  ...pptrBlocks,
  ...testBlocks,
  ...zhilingBlocks,
  ...ObjectBlocks
]

export const BlockGenerators = Object.assign({}, ...[
  logicalBlocks,
  textBlockGenerators,
  eventBlockGenerators,
  sessionBlockGenerators,
  messageBlocks,
  segmentBlockGenerators,
  dataBlockGenerators,
  botBlockGenerators,
  debugBlockGenerators,
  environmentBlockGenerators,
  numberBlockGenerators,
  nullBlockGenerators,
  importBlockGenerators,
  atBlockGenerators,
  pptrBlockGenerators,
  testBlockGenerators,
  zhilingBlockGenerators,
  ObjectBlockGenerators
])
