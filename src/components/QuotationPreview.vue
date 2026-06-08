<template>
  <div class="quotation-preview" ref="previewRef" :style="rootStyle">
    <div class="preview-header" :style="headerStyle">
      <div class="header-left">
        <img v-if="quotation.company.logo" :src="quotation.company.logo" class="company-logo" />
        <div class="company-info">
          <h1 class="company-name">{{ quotation.company.name || '公司名称' }}</h1>
          <p v-if="quotation.company.address">{{ quotation.company.address }}</p>
          <p v-if="quotation.company.phone || quotation.company.email">
            <span v-if="quotation.company.phone">电话：{{ quotation.company.phone }}</span>
            <span v-if="quotation.company.email"> 邮箱：{{ quotation.company.email }}</span>
          </p>
        </div>
      </div>
      <div class="header-right">
        <h2 class="doc-title">报 价 单</h2>
        <p class="doc-no">编号：{{ quotation.quotationNo }}</p>
      </div>
    </div>

    <div class="preview-body">
      <div class="info-section">
        <div class="info-block">
          <h3 :style="{ color: style.primaryColor }">客户信息</h3>
          <p><strong>{{ quotation.customer.name || '客户名称' }}</strong></p>
          <p v-if="quotation.customer.contact">联系人：{{ quotation.customer.contact }}</p>
          <p v-if="quotation.customer.address">地址：{{ quotation.customer.address }}</p>
          <p v-if="quotation.customer.phone">电话：{{ quotation.customer.phone }}</p>
          <p v-if="quotation.customer.email">邮箱：{{ quotation.customer.email }}</p>
        </div>
        <div class="info-block">
          <h3 :style="{ color: style.primaryColor }">报价信息</h3>
          <p>报价日期：{{ quotation.date }}</p>
          <p>有效期至：{{ quotation.validUntil }}</p>
          <p>付款条件：{{ quotation.paymentTerms }}</p>
        </div>
      </div>

      <table class="items-table" :style="tableStyle">
        <thead>
          <tr :style="{ backgroundColor: style.headerBg, color: style.headerColor }">
            <th style="width:50px">序号</th>
            <th>项目名称</th>
            <th>规格/描述</th>
            <th style="width:60px">单位</th>
            <th style="width:80px">数量</th>
            <th style="width:100px">单价</th>
            <th style="width:110px">小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in quotation.items" :key="item.id" :style="rowStyle(idx)">
            <td class="center">{{ idx + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td class="center">{{ item.unit }}</td>
            <td class="right">{{ item.quantity }}</td>
            <td class="right">¥{{ formatMoney(item.price) }}</td>
            <td class="right">¥{{ formatMoney(item.amount) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary-section">
        <div class="summary-table">
          <div class="summary-row">
            <span>小计</span>
            <span>¥{{ formatMoney(quotation.subtotal) }}</span>
          </div>
          <div class="summary-row" v-if="quotation.discountAmount > 0">
            <span>折扣{{ quotation.discountType === 'percent' ? `（${quotation.discountValue}%）` : '' }}</span>
            <span>－¥{{ formatMoney(quotation.discountAmount) }}</span>
          </div>
          <div class="summary-row">
            <span>税额（{{ quotation.taxRate }}%{{ quotation.taxIncluded ? '，含税' : '' }}）</span>
            <span>¥{{ formatMoney(quotation.taxAmount) }}</span>
          </div>
          <div class="summary-row total" :style="{ color: style.primaryColor }">
            <span>总计</span>
            <span>¥{{ formatMoney(quotation.total) }}</span>
          </div>
        </div>
      </div>

      <div class="notes-section" v-if="quotation.notes">
        <h3 :style="{ color: style.primaryColor }">备注</h3>
        <p>{{ quotation.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Quotation, TemplateStyle } from '@/types'
import { formatMoney } from '@/utils/helpers'
import { useTemplateStore } from '@/stores/template'

const props = defineProps<{
  quotation: Quotation
}>()

const previewRef = ref<HTMLElement>()

const templateStore = useTemplateStore()
const template = computed(() => templateStore.getTemplate(props.quotation.templateId))
const style = computed<TemplateStyle>(() => template.value.style)

const rootStyle = computed(() => ({
  fontFamily: style.value.fontFamily,
  borderColor: style.value.borderColor
}))

const headerStyle = computed(() => ({
  backgroundColor: style.value.headerBg,
  color: style.value.headerColor
}))

const tableStyle = computed(() => ({
  borderColor: style.value.borderColor
}))

function rowStyle(idx: number) {
  return idx % 2 === 1 ? { backgroundColor: style.value.stripeBg } : {}
}

defineExpose({ previewRef })
</script>

<script lang="ts">
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.quotation-preview {
  background: #fff;
  border: 1px solid #ddd;
  max-width: 800px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 36px 24px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    .company-logo {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .company-info {
      h1 {
        font-size: 18px;
        margin: 0 0 6px;
        font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
        font-weight: 700;
      }
      p {
        margin: 0;
        font-size: 13px;
        opacity: 0.9;
      }
    }
  }
  .header-right {
    text-align: right;
    .doc-title {
      font-size: 26px;
      margin: 0;
      font-weight: 700;
      font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
      letter-spacing: 4px;
    }
    .doc-no {
      margin: 6px 0 0;
      font-size: 13px;
      opacity: 0.8;
    }
  }
}

.preview-body {
  padding: 0 36px 36px;
}

.info-section {
  display: flex;
  gap: 48px;
  margin-top: 28px;
  margin-bottom: 28px;
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  .info-block {
    flex: 1;
    h3 {
      font-size: 14px;
      margin: 0 0 10px;
      font-weight: 700;
      font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
    }
    p {
      margin: 4px 0;
      font-size: 13px;
      color: #444;
      line-height: 1.8;
      strong {
        font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  font-family: 'SimSun', '宋体', serif;
  th {
    font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px 10px;
    font-size: 13px;
  }
  th {
    font-weight: 700;
    font-size: 13px;
  }
  td {
    font-family: 'SimSun', '宋体', serif;
  }
  .center { text-align: center; }
  .right { text-align: right; }
}

.summary-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 28px;
  .summary-table {
    width: 320px;
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 0;
      border-bottom: 1px solid #eee;
      font-size: 13px;
      font-family: 'SimSun', '宋体', serif;
    }
    .total {
      font-size: 16px;
      font-weight: 700;
      border-bottom: none;
      border-top: 2px solid #333;
      padding-top: 10px;
      margin-top: 4px;
      font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
    }
  }
}

.notes-section {
  margin-bottom: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  h3 {
    font-size: 14px;
    margin: 0 0 10px;
    font-weight: 700;
    font-family: 'SimHei', '黑体', 'Microsoft YaHei', sans-serif;
  }
  p {
    font-size: 13px;
    color: #555;
    white-space: pre-wrap;
    line-height: 1.8;
  }
}
</style>