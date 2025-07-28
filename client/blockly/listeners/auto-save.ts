import { Abstract } from "blockly/core/events/events_abstract";
import { BlockMove } from "blockly/core/events/events_block_move";
import { BlockCreate } from "blockly/core/events/events_block_create";

export function autoSaveListener(this: { autoSave: Function }, _event: Abstract) {
  if (!(_event.type === 'create' || _event.type === 'move' || _event.type === 'delete' || _event.type === 'change')) return;
  this.autoSave();
}
