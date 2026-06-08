<template>
  <div class="template-market">
    <div class="template-grid">
      <div
        v-for="t in templates"
        :key="t.id"
        class="template-card"
        :class="{ active: modelValue === t.id }"
        @click="$emit('update:modelValue', t.id)"
      >
        <div class="template-preview" :style="previewStyle(t.style)">
          <div class="mini-header" :style="{ backgroundColor: t.style.headerBg, color: t.style.headerColor }">
            <div class="mini-logo"></div>
            <div class="mini-title">报价单</div>
          </div>
          <div class="mini-body">
            <div class="mini-row" v-for="i in 3" :key="i" :style="i % 2 === 0 ? { backgroundColor: t.style.stripeBg } : {}">
              <div class="mini-cell" v-for="j in 4" :key="j"></div>
            </div>
          </div>
          <div class="mini-footer">
            <div class="mini-total" :style="{ color: t.style.primaryColor }"></div>
          </div>
        </div>
        <div class="template-info">
          <div class="template-name">
            {{ t.name }}
            <el-icon v-if="modelValue === t.id" class="check-icon"><Check /></el-icon>
          </div>
          <div class="template-desc">{{ t.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Template } from '@/types'

defineProps<{
  templates: Template[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

function previewStyle(style: Template['style']) {
  return {
    borderColor: style.borderColor,
    fontFamily: style.fontFamily
  }
}
</script>

<style lang="scss" scoped>
.template-market {
  width: 100%;
}
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.template-card {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;

  &:hover {
    border-color: #c0c4cc;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  &.active {
    border-color: #409eff;
    box-shadow: 0 0 0 1px #409eff;
  }
}
.template-preview {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mini-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 3px;
  .mini-logo {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    background: rgba(255,255,255,0.3);
  }
  .mini-title {
    font-size: 10px;
    font-weight: 700;
  }
}
.mini-body {
  flex: 1;
  .mini-row {
    display: flex;
    gap: 4px;
    padding: 3px 4px;
    .mini-cell {
      flex: 1;
      height: 6px;
      background: #e0e0e0;
      border-radius: 1px;
    }
  }
}
.mini-footer {
  display: flex;
  justify-content: flex-end;
  .mini-total {
    width: 60%;
    height: 8px;
    border-radius: 1px;
    background: currentColor;
    opacity: 0.2;
  }
}
.template-info {
  padding: 10px 12px;
}
.template-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 4px;
  .check-icon {
    color: #409eff;
  }
}
.template-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
