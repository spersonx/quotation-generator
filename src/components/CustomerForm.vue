<template>
  <div class="card section-card">
    <h3 class="section-title">客户信息</h3>
    <el-form :model="model" label-width="80px" label-position="top">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="客户名称">
            <el-input v-model="model.name" placeholder="请输入客户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人">
            <el-input v-model="model.contact" placeholder="请输入联系人" />
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
import type { CustomerInfo } from '@/types'

const model = defineModel<CustomerInfo>({ required: true })
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
</style>
