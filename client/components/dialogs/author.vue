<script setup lang="ts">
import {computed, ref, watch} from "vue";

const content = ref({
  name: '',
  email: ''
})

const model = defineProps(["modelValue"])

const $emit = defineEmits(['update:modelValue','callback'])

const visible = ref<any>(false)

function execute(){
  if(!content.value.name || !content.value.email){
    return
  }
  if(!content.value.name.match(/^[A-Za-z0-9_-]+$/)){
    alert('作者名称只能包含英文、数字、下划线和中划线')
    return
  }
  if(!content.value.email.match(/^[A-Za-z0-9_-]+@[A-Za-z0-9_\-.]+$/)){
    alert('作者邮箱格式不正确')
    return
  }
  $emit('update:modelValue',false)
  $emit('callback',content.value.name+'<'+content.value.email+'>')
  content.value.name = undefined
  content.value.email = undefined
}

watch(model,(newValue)=>{
  visible.value = !!model.modelValue;
  const regex = /^([A-Za-z0-9_-]+)<([A-Za-z0-9_-]+@[A-Za-z0-9_\-.]+)>$/
  const match = regex.exec(model.modelValue)
  if(match){
    content.value.name = match[1]
    content.value.email = match[2]
  }
});

watch(visible,(newValue)=>{
  $emit('update:modelValue',newValue?newValue:undefined)
})




</script>
<template>
  <transition name="dialog-fade">
    <div v-if="visible" class="author-dialog-overlay" @click.self="$emit('update:modelValue')">
      <transition name="dialog-zoom">
        <div v-if="visible" class="author-dialog">
          <div class="author-dialog-header">
            <h3>设置作者</h3>
            <button class="close-btn" @click="$emit('update:modelValue')">×</button>
          </div>
          <div class="author-dialog-body">
            <div class="form-item">
              <label>作者名称</label>
              <input 
                v-model="content.name" 
                placeholder="请使用英文名称" 
                class="author-input"
              />
            </div>
            <div class="form-item">
              <label>作者邮箱</label>
              <input 
                v-model="content.email" 
                placeholder="作者邮箱" 
                class="author-input"
              />
            </div>
          </div>
          <div class="author-dialog-footer">
            <button class="btn btn-cancel" @click="$emit('update:modelValue')">关闭</button>
            <button class="btn btn-primary" @click="execute()">确定</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.author-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.author-dialog {
  background: var(--bg0, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.author-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e4e7ed);
}

.author-dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--fg0, #303133);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--fg2, #909399);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--fg0, #303133);
}

.author-dialog-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--fg0, #303133);
  font-weight: 500;
}

.author-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border, #dcdfe6);
  border-radius: 4px;
  font-size: 14px;
  color: var(--fg0, #303133);
  background-color: var(--bg0, #ffffff);
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.author-input:focus {
  outline: none;
  border-color: var(--primary, #409eff);
}

.author-input::placeholder {
  color: var(--fg3, #c0c4cc);
}

.author-dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border, #e4e7ed);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s;
}

.btn-cancel {
  background: var(--bg0, #ffffff);
  border-color: var(--border, #dcdfe6);
  color: var(--fg0, #303133);
}

.btn-cancel:hover {
  background: var(--bg1, #f5f7fa);
  border-color: var(--primary, #409eff);
  color: var(--primary, #409eff);
}

.btn-primary {
  background: var(--primary, #409eff);
  border-color: var(--primary, #409eff);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--primary-light, #66b1ff);
  border-color: var(--primary-light, #66b1ff);
}

/* 动画效果 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-zoom-enter-active,
.dialog-zoom-leave-active {
  transition: all 0.3s ease;
}

.dialog-zoom-enter-from,
.dialog-zoom-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(-20px);
}

.dialog-zoom-enter-to,
.dialog-zoom-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
