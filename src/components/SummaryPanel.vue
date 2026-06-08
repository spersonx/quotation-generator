<template>
  <div class="card section-card">
    <h3 class="section-title">金额汇总</h3>
    <div class="summary-form">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="折扣类型">
              <el-select v-model="quotation.discountType" @change="handleRecalc" style="width:100%">
                <el-option label="百分比 (%)" value="percent" />
                <el-option label="固定金额" value="fixed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折扣值">
              <el-input-number v-model="quotation.discountValue" :min="0" :precision="2" controls-position="right" style="width:100%" @change="handleRecalc" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="税率 (%)">
              <el-input-number v-model="quotation.taxRate" :min="0" :max="100" :precision="2" controls-position="right" style="width:100%" @change="handleRecalc" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格含税">
              <el-switch :model-value="!quotation.taxIncluded" @update:model-value="quotation.taxIncluded = !$event; handleRecalc()" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="summary-result">
      <div class="summary-row">
        <span>小计</span>
        <span>¥{{ formatMoney(quotation.subtotal) }}</span>
      </div>
      <div class="summary-row" v-if="quotation.discountAmount > 0">
        <span>折扣</span>
        <span class="discount">-¥{{ formatMoney(quotation.discountAmount) }}</span>
      </div>
      <div class="summary-row">
        <span>税额 ({{ quotation.taxRate }}%)</span>
        <span>¥{{ formatMoney(quotation.taxAmount) }}</span>
      </div>
      <div class="summary-row total-row">
        <span>总计</span>
        <span class="total-amount">¥{{ formatMoney(quotation.total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quotation } from '@/types'
import { useQuotationStore } from '@/stores/quotation'
import { formatMoney } from '@/utils/helpers'

const props = defineProps<{
  quotation: Quotation
}>()

const store = useQuotationStore()

function handleRecalc() {
  store.recalculate(props.quotation.id)
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
.summary-form {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-select, .el-input-number {
    width: 100%;
  }
}
.summary-result {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
  .discount {
    color: #f56c6c;
  }
}
.total-row {
  border-top: 2px solid #dcdfe6;
  margin-top: 8px;
  padding-top: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  .total-amount {
    color: #409eff;
  }
}
</style>
