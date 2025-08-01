<template>
  <div style="height: 100%;flex:auto;margin-bottom: 35px">
    <text-template v-model="currentDialogValue" v-model:current="currentDialog"></text-template>
    <div
      style="width: 100%;padding: 5px;height:25px;border-bottom: 1px solid var(--bg1);display: flex;flex-direction: row-reverse;">
      <button class="menu-button" @click="$emit('update:workspace', 'meta')">编辑插件元数据</button>
    </div>
    <div style="height: 100%;flex:auto" ref="blockly_workspace" @mouseleave="handleMouseLeave"
      @mouseenter="handleMouseEnter"></div>
  </div>
</template>

<script setup lang="ts">
import * as Blockly from 'blockly';
import * as ZhHans from 'blockly/msg/zh-hans';
import * as LexicalVariables from '@mit-app-inventor/blockly-block-lexical-variables';
import Toolbox from './toolbox.xml?raw';
import { javascriptGenerator } from 'blockly/javascript';
import { ref, onMounted, onUnmounted, toRef, nextTick, watch, toRaw } from 'vue';
import { Blocks, BlockGenerators } from "./blocks";
import { registerExtensions } from "./extensions";
import { disableOrphansAndOrphanConsumersEvent } from "./listeners/consumer";
import { autoSaveListener } from "./listeners/auto-save";
import './msg/zh'
import { defineBlocksWithJsonCustomFields } from "./definer";
import { vendorCallback } from "./vendor";
import TextTemplate from "../components/dialogs/text-template.vue";
import { registerScope } from "./plugins/scope";
import { registerTypeManager } from "./plugins/type";
import { FieldBindingStringDropdown } from "./fields/binding";
import { initializeType, TypedConnectionChecker } from "./typing";

const blockly_workspace = ref(null)


let value = defineProps({
  modelValue: Object,
  workspace: String
})

let currentDialog = ref(null)

let currentDialogValue = ref(null)

let _value = toRef(value, "modelValue")

let emits = defineEmits(['update:modelValue', 'update:workspace'])

Blockly.setLocale(ZhHans);

defineBlocksWithJsonCustomFields(Blocks);

registerExtensions();
initializeType();
Object.entries(BlockGenerators).forEach(([k, v]) => {
  javascriptGenerator[k] = v;
})
let workspace: Blockly.WorkspaceSvg = null;
let listeners = { autoSave: () => { } }
let closeEditorTimeout: number | null = null;

Blockly.VerticalFlyout.prototype.getFlyoutScale = () => 1;

// 处理鼠标进入工作区事件
const handleMouseEnter = () => {
  // 取消之前的延迟关闭
  if (closeEditorTimeout) {
    clearTimeout(closeEditorTimeout);
    closeEditorTimeout = null;
  }
};

// 处理鼠标离开工作区事件
const handleMouseLeave = (event: MouseEvent) => {
  if (!workspace) return;

  const workspaceElement = blockly_workspace.value;
  if (!workspaceElement) return;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
  if (elementUnderMouse) {
    // 如果鼠标移动到了菜单、工具箱或其他Blockly相关元素上，不关闭编辑器
    const isBlocklyElement = elementUnderMouse.closest('.blocklyContextMenu') ||
      elementUnderMouse.closest('.blocklyToolboxDiv') ||
      elementUnderMouse.closest('.blocklyWidgetDiv') ||
      elementUnderMouse.closest('.blocklyDropDownDiv') ||
      elementUnderMouse.closest('.blocklyFlyout') ||
      elementUnderMouse.closest('.blocklyMenu') ||
      elementUnderMouse.closest('.goog-menu');

    if (isBlocklyElement) {
      return;
    }
  }

  closeEditorTimeout = window.setTimeout(() => {
    closeEditorTimeout = null;

    const currentMouseX = event.clientX;
    const currentMouseY = event.clientY;
    const currentElement = document.elementFromPoint(currentMouseX, currentMouseY);

    if (currentElement) {
      const isStillInBlockly = currentElement.closest('.blocklyWorkspace') ||
        currentElement.closest('.blocklyContextMenu') ||
        currentElement.closest('.blocklyToolboxDiv') ||
        currentElement.closest('.blocklyWidgetDiv') ||
        currentElement.closest('.blocklyDropDownDiv') ||
        currentElement.closest('.blocklyFlyout') ||
        currentElement.closest('.blocklyMenu') ||
        currentElement.closest('.goog-menu');

      if (isStillInBlockly) {
        return;
      }
    }

    try {
      if (Blockly.WidgetDiv && Blockly.WidgetDiv.isVisible()) {
        // 检查是否有活跃的文本输入
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          (activeElement as HTMLElement).blur();
        }
        Blockly.WidgetDiv.hide();
      }
    } catch (error) {
      console.warn('Error closing text editor:', error);
    }
  }, 200);
};

onMounted(() => {
  nextTick(() => {
    workspace = Blockly.inject(blockly_workspace.value, {
      toolbox: Toolbox,
      media: '/static/blockly/',
      grid: {
        spacing: 20,
        length: 1,
        colour: '#888',
        snap: false
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      plugins: {
        'connectionChecker': TypedConnectionChecker
      }
    })
    window.addEventListener('resize', () => {
      Blockly.svgResize(workspace)
    })
    workspace.registerToolboxCategoryCallback('VENDOR_UNCATEGORIZED', vendorCallback)
    workspace.addChangeListener(disableOrphansAndOrphanConsumersEvent);
    workspace.addChangeListener(autoSaveListener.bind(listeners));
    registerScope(workspace);
    registerTypeManager(workspace)
    Blockly.fieldRegistry.register('binding', FieldBindingStringDropdown);
    LexicalVariables.init(workspace);
    workspace['topLevel'] = {
      openDialog(name, value) {
        currentDialog.value = name;
        currentDialogValue.value = value;
        return new Promise((resolve) => {
          const disposable = watch(currentDialog, () => {
            disposable();
            resolve(toRaw(currentDialogValue.value))
          })
        })
      },
    }
  })
})

onUnmounted(() => {
  // 清理定时器
  if (closeEditorTimeout) {
    clearTimeout(closeEditorTimeout);
    closeEditorTimeout = null;
  }
})
defineExpose({
  save() {
    Blockly.svgResize(workspace);
    return Blockly.serialization.workspaces.save(workspace);
  },
  load(data) {
    Blockly.svgResize(workspace);
    return Blockly.serialization.workspaces.load(data, workspace);
  },
  setAutoSaveListener(listener) {
    listeners.autoSave = listener
  },
  updateSize() {
    Blockly.svgResize(workspace);
  },
  getWorkspaceSvg() {
    return workspace;
  }
})
</script>

<style scoped lang="scss">
.menu-button {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 3px 8px;
  margin: 0 10px;
  background: var(--bg3);
  color: var(--fg0);

  &:hover {
    background: var(--bg2);
    border-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
