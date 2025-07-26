<script setup lang="ts">
import { computed, ref, watch, toRaw, onMounted } from "vue";
import { store, send } from "@koishijs/client";
import * as Blockly from "blockly";
import AuthorDialog from './components/dialogs/author.vue'
import { workspaces } from "blockly/core/serialization";
import { WorkspaceSvg } from "blockly";
import { deduplicate } from "cosmokit";

const $emit = defineEmits(['update:workspace', 'metaChange'])

const props: { workspace?: WorkspaceSvg, current?: any } = defineProps(['current', 'workspace'])

const commandBlocks = ref([])

// 添加本地数据存储
const localBlocklyData = ref([])

// 获取数据函数
const fetchBlocklyData = async () => {
  try {
    const response = await send('get-all-blockly-blocks')
    return response
  } catch (error) {
    console.error('获取meta页面插件数据失败:', error)
    return null
  }
}

// 刷新数据函数
const refreshData = async () => {
  const freshData = await fetchBlocklyData()
  if (freshData && Array.isArray(freshData)) {
    localBlocklyData.value = freshData
  }
}

const blockUUID = computed(() => {
  // 优先从本地数据中查找，如果没有则从store中查找
  const allBlocks = localBlocklyData.value.length > 0 ? localBlocklyData.value : store.blockly
  return allBlocks.find(t => t.id.toString() === props.current?.toString())
})
const meta = ref({
  author: undefined,
  description: "",
  commands: {},
  tables: {}
})

function checkBlocks(this: WorkspaceSvg) {
  commandBlocks.value = []
  this.getAllBlocks(false).forEach(block => {
    if (block.type === 'command') {
      commandBlocks.value.push(block)
    }
  })
}

try {
  Blockly.serialization.registry.unregister('plugin-meta')
  Blockly.serialization.registry.register('plugin-meta', {
    save(workspace) {
      workspace.meta = toRaw(meta.value)
      return meta.value
    },
    load(state: any, workspace) {
      if (!state) return
      meta.value.author = state.author
      meta.value.description = state.description ?? undefined
      workspace['metaListener'] = checkBlocks.bind(workspace)
      workspace.addChangeListener(workspace['metaListener'])
      workspace['metaListener']();
      meta.value.commands = state.commands ?? {};
      meta.value.tables = state.tables ?? {};
      workspace.meta = toRaw(meta.value)
    },
    clear(workspace) {
      meta.value.description = ''
      meta.value.author = undefined
      workspace.removeChangeListener(workspace['metaListener'])
      workspace.meta = {}
    },
    priority: 10
  })
} catch (e) {
  console.error(e)
}

function editAuthorCallback(e) {
  meta.value.author = e
  $emit('metaChange')
}

watch(meta.value, () => {
  $emit('metaChange')
})

const editAuthor = ref(undefined)

function createTable() {
  const table = prompt('请输入数据表名')
  if (!table) return
  meta.value.tables[table] = {
    columns: {}
  }
}

const commandBlockNames = computed(() => commandBlocks.value.map(t => t.getFieldValue('name')))

const mergedCommandBlockNames = computed(() => deduplicate([...commandBlockNames.value, ...Object.keys(meta.value.commands)]))

// SHA256校验值
const sha256Hash = ref("96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e")
const showCopyButton = ref(false)
const showUuidCopyButton = ref(false)

// 复制到剪贴板功能
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(sha256Hash.value)
    // 可以添加一个提示消息
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 复制UUID到剪贴板功能
const copyUuidToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(blockUUID.value?.uuid || '')
    // 可以添加一个提示消息
  } catch (err) {
    console.error('复制UUID失败:', err)
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  await refreshData()
})


</script>

<template>
  <author-dialog v-model="editAuthor" @callback="editAuthorCallback"></author-dialog>
  <div
    style="display: flex;flex-flow: column;contain: size;overflow: hidden;height:100%;background-color: var(--bg0);backdrop-filter: blur(2px);-webkit-backdrop-filter: blur(2px);">
    <div
      style="width: 100%;padding: 5px;padding-left: 20px;height:25px;border-bottom: 1px solid var(--bg1);background-color: var(--bg1);">
      <button class="menu-button" @click="$emit('update:workspace', 'blockly')">退出元数据编辑</button>
    </div>
    <el-scrollbar style="flex: auto;background-color: var(--bg0);">
      <div style="padding: 20px;background-color: var(--bg0);">
        <h2>插件基本信息</h2>
        <p>插件ID:{{ props.current }}</p>
        <div>
          <label>插件UUID:</label>
          <div class="uuid-container" @mouseenter="showUuidCopyButton = true" @mouseleave="showUuidCopyButton = false">
            <pre class="uuid-code">{{ blockUUID?.uuid }}</pre>
            <button v-show="showUuidCopyButton" class="copy-button" @click="copyUuidToClipboard" title="复制到剪贴板">
              📋
            </button>
          </div>
        </div>
        <p>插件作者: {{ meta.author ?? '未署名' }}<k-button @click="editAuthor = meta.author ?? true">修改</k-button></p>
        插件描述: <br><el-input type="textarea" v-model="meta.description"></el-input>
        <h2>数据库</h2>
        <el-button @click="createTable">新建数据表</el-button>
        <el-table v-model="meta.tables">
          <el-table-column prop="table" label="数据表名" width="180" />
          <el-table-column prop="columns" label="字段" width="180" />
          <el-table-column prop="operation" label="操作" />
        </el-table>
        <h2>指令</h2>
        <div>
          <div v-for="(command, i) in mergedCommandBlockNames">
            <h3 :class="commandBlockNames.includes(command) ? '' : 'disabled-title'">{{ command }} <el-button
                v-if="meta.commands[command]" @click="delete meta.commands[command]">删除</el-button></h3>
            <k-button v-if="!meta.commands[command]"
              @click="meta.commands[command] = { authority: 0 }">设置指令信息</k-button>
            <template v-else>
              <el-input type="textarea" v-model="meta.commands[command].description"></el-input>
              最低权限等级<el-input-number v-model="meta.commands[command].authority"></el-input-number>
            </template>
          </div>
        </div>
        <h2>存储空间</h2>
        暂未支持
        <h2>其他信息</h2>
        <div>
          <label>SHA256校验值:</label>
          <div class="sha256-container" @mouseenter="showCopyButton = true" @mouseleave="showCopyButton = false">
            <pre class="sha256-code">{{ sha256Hash }}</pre>
            <button v-show="showCopyButton" class="copy-button" @click="copyToClipboard" title="复制到剪贴板">
              📋
            </button>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

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

.disabled-title {
  color: var(--fg3);
}

// 为Element UI组件设置深色背景
:deep(.el-input__inner) {
  background-color: var(--bg1);
  color: var(--fg0);
  border-color: var(--bg3);
}

:deep(.el-textarea__inner) {
  background-color: var(--bg1);
  color: var(--fg0);
  border-color: var(--bg3);
}

:deep(.el-button) {
  background-color: var(--bg2);
  color: var(--fg0);
  border-color: var(--bg3);

  &:hover {
    background-color: var(--bg3);
    color: var(--fg0);
  }
}

:deep(.el-table) {
  background-color: var(--bg1);
  color: var(--fg0);

  th {
    background-color: var(--bg2);
    color: var(--fg0);
    border-color: var(--bg3);
  }

  td {
    background-color: var(--bg1);
    color: var(--fg0);
    border-color: var(--bg3);
  }
}

:deep(.el-input-number) {
  .el-input__inner {
    background-color: var(--bg1);
    color: var(--fg0);
    border-color: var(--bg3);
  }

  .el-input-number__increase,
  .el-input-number__decrease {
    background-color: var(--bg2);
    color: var(--fg0);
    border-color: var(--bg3);

    &:hover {
      background-color: var(--bg3);
    }
  }
}

:deep(.el-scrollbar__thumb) {
  background-color: var(--bg3);
}

:deep(.el-scrollbar__bar) {
  background-color: var(--bg2);
}

// SHA256校验值和UUID代码块样式
.sha256-container,
.uuid-container {
  position: relative;
  margin-top: 8px;
  border: 1px solid var(--bg3);
  border-radius: 6px;
  background-color: var(--bg1);
  padding: 12px;

  &:hover {
    border-color: var(--bg2);
  }
}

.sha256-code,
.uuid-code {
  margin: 0;
  padding: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: var(--fg0);
  background: transparent;
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  user-select: all;
}

.copy-button {
  position: absolute;
  top: 2px;
  right: 8px;
  background: var(--bg2);
  border: 1px solid var(--bg3);
  border-radius: 6px;
  padding: 8px 16px;
  color: var(--fg0);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg3);
    border-color: var(--fg3);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
