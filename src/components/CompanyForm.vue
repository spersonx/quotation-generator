<template>
  <div class="card section-card">
    <h3 class="section-title">公司信息</h3>
    <el-form :model="model" label-width="80px" label-position="top">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Logo">
            <div class="logo-upload" @click="triggerUpload">
              <img v-if="model.logo" :src="model.logo" class="logo-preview" />
              <el-icon v-else :size="32" color="#c0c4cc"><Plus /></el-icon>
            </div>
            <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleLogoChange" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="公司名称">
            <el-input v-model="model.name" placeholder="请输入公司名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input v-model="model.phone" placeholder="请输入电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="model.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="地址">
        <el-input v-model="model.address" placeholder="请输入地址" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CompanyInfo } from '@/types'

const model = defineModel<CompanyInfo>({ required: true })
const fileInput = ref<HTMLInputElement>()

function triggerUpload() {
  fileInput.value?.click()
}

function handleLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    model.value.logo = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
}
.logo-upload {
  width: 80px;
  height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
  &:hover {
    border-color: #409eff;
  }
  .logo-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
