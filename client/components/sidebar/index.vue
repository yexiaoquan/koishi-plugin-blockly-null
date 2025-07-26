<script setup lang="ts">
  import BlocklyTabGroup from '../blockly-tab-group.vue'
  import {computed, ref, nextTick, onMounted} from "vue";
  import { store, send} from "@koishijs/client";
  import {ElMessageBox} from "element-plus";
  import ImportIcon from "../../icons/import.vue"
  import NewFile from "../../icons/new-file.vue";
  import {
    createBlockly as create,
    deletePlugin as __delete,
    enableBlockly,
    disableBlockly,
    renameBlockly as rename,
    exportPlugin as _export,
    buildBlockly as build,
    saveBlockly
  } from "../../api/manager";

  const props = defineProps(['blocks','workspace','dialog','current','panel','logger','refreshMain','refresh-main'])
  const $emit = defineEmits(['update:dialog','update:current'])

  const { panel,blocks } = props

  // 创建本地数据存储作为主要数据源
  const localBlocklyData = ref([])
  const forceUpdate = ref(0)
  const dataLoaded = ref(false) // 标记数据是否已加载

  const current = computed({
    get:()=>props.current,
    set:(val)=>$emit('update:current',val)
  })

  const dialog = computed({
    get:()=>props.dialog,
    set:(val)=>$emit('update:dialog',val)
  })

  // 直接获取数据的函数
  const fetchBlocklyData = async () => {
    try {
      const response = await send('get-all-blockly-blocks')
      return response
    } catch (error) {
      console.error('获取插件数据失败:', error)
      return null
    }
  }

  // 刷新数据函数
  const refreshData = async () => {
    const freshData = await fetchBlocklyData()
    if (freshData && Array.isArray(freshData)) {
      localBlocklyData.value = freshData
      dataLoaded.value = true // 标记数据已加载
      forceUpdate.value++
      await nextTick()
    }
  }

  const buildBlockly = async ()=> {
    await saveBlockly(current.value,props.workspace)
    if (current.value == undefined) {
      return
    }
    
    const allBlocks = dataLoaded.value ? localBlocklyData.value : store.blockly
    const block = allBlocks.find(t=>t.id==current.value)
    
    if (!block) {
      console.error('找不到插件数据，ID:', current.value)
      return
    }
    
    const result = await build(current.value, block.name, block.uuid, props.workspace, props.logger.logger)
    if (result) {
      panel.code = result
    }
  }

  async function renameBlockly(){
    const name = prompt('输入重命名的插件名词','未命名Koishi插件')
    if(name!=null) {
      await rename(current.value,name)
      await refreshData() // 刷新数据
    }
  }

  async function deleteBlockly() {
    if(current.value==undefined){
      return
    }
    if(await ElMessageBox.confirm("确定删除当前插件?") === 'confirm'){
      await __delete(current.value)
      current.value = undefined // 清空当前选择
      await refreshData() // 刷新数据
      forceUpdate.value++ // 强制更新组件
    }
  }

  async function exportBlockly(){
    if(current.value==undefined){
      return
    }
    
    const allBlocks = dataLoaded.value ? localBlocklyData.value : store.blockly
    const block = allBlocks.find(t=>t.id==current.value)
    
    if (!block) {
      console.error('找不到插件数据，ID:', current.value)
      return
    }
    
    const result = await _export(current.value, block.name, block.uuid, props.workspace)
    if(result){
      dialog.value.export = result
    }
  }

  async function createBlockly(){
    const newId = await create()
    await refreshData() // 刷新数据
    
    // 等待一小段时间确保数据更新完成
    setTimeout(() => {
      $emit('update:current', newId)
    }, 100)
  }

  // 组件挂载时初始化数据
  onMounted(async () => {
    await refreshData()
  })


</script>

<template>
  <div class="create" style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 10px;height: 48px;">
    <el-popover
    placement="bottom"
      trigger="hover"
      content="新建插件"
    >
      <template #reference>
        <i @click="createBlockly" style="cursor: pointer;padding-right: 20px;"><new-file/></i>
      </template>
    </el-popover>
    <el-popover
    placement="bottom"
    trigger="hover"
    content="导入代码"
    >
    <template #reference>
      <i @click="dialog.import=true" style="cursor: pointer;padding-right: 20px;"><import-icon/></i>
    </template>
  </el-popover>
  <div style="flex-grow: 1;"></div>
  <div style="font-size: 18px;font-weight: bold;margin-left: 19px;">
    插件列表
  </div>
  
  </div>
  <div class="list" style="height: 60%">
    <el-scrollbar>
      <blockly-tab-group :key="forceUpdate" :data="Object.fromEntries((dataLoaded ? localBlocklyData : store.blockly).map(t=>[t.id,t]))" v-model="current">
      </blockly-tab-group>
    </el-scrollbar>
  </div>
  <div style="height: 40%;padding:10px">
    <div v-if="current">
      <h3>操作</h3>
      
      <k-button @click="buildBlockly()">编译插件</k-button>
      <br>
      <k-button @click="async ()=>{await enableBlockly(current); await refreshData()}">启用插件</k-button>
      <k-button @click="async ()=>{await disableBlockly(current); await refreshData()}">禁用插件</k-button>
      <br>

      <k-button @click="renameBlockly()">重命名插件</k-button>
      <k-button @click="deleteBlockly()">删除插件</k-button>
      <br>

      <k-button @click="exportBlockly()">导出插件</k-button>
    </div>
  </div>
</template>
