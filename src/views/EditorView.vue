<template>
  <div class="page-container">
    <!-- 常驻基本信息栏 -->
    <div v-if="quotation" class="basic-info-bar" data-tutorial="basic-info">
      <div class="bar-title">基本信息</div>
      <div class="bar-body">
        <div class="bar-left">
          <div class="field-item">
            <label class="field-label">报价单编号</label>
            <el-input v-model="quotation.quotationNo" />
          </div>
          <div class="field-item">
            <label class="field-label">报价日期</label>
            <el-date-picker v-model="quotation.date" type="date" value-format="YYYY-MM-DD" style="width:100%" />
          </div>
          <div class="field-item">
            <label class="field-label">有效期至</label>
            <el-date-picker v-model="quotation.validUntil" type="date" value-format="YYYY-MM-DD" style="width:100%" />
          </div>
          <div class="field-item">
            <label class="field-label">付款条件</label>
            <el-input v-model="quotation.paymentTerms" />
          </div>
        </div>
        <div class="bar-right" data-tutorial="save-actions">
          <el-button @click="handleSaveToLocal" plain size="small">
            <el-icon><Download /></el-icon> 保存到本地
          </el-button>
          <el-button type="primary" @click="handleSave" size="small">暂存</el-button>
        </div>
      </div>
    </div>

    <!-- 步骤条 -->
    <div v-if="quotation" class="steps-wrapper" data-tutorial="steps">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="公司与客户" icon="User" />
        <el-step title="项目明细" icon="List" />
        <el-step title="模板市场" icon="PictureFilled" />
        <el-step title="预览导出" icon="Document" />
      </el-steps>
    </div>

    <!-- 步骤内容 -->
    <div v-if="quotation" class="step-content">
      <!-- 步骤1: 公司与客户 -->
      <div v-show="currentStep === 0" class="step-panel" data-tutorial="company-customer">
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12">
            <CompanyForm v-model="quotation.company" />
          </el-col>
          <el-col :xs="24" :lg="12">
            <CustomerForm v-model="quotation.customer" />
          </el-col>
        </el-row>
      </div>

      <!-- 步骤2: 项目明细 + 金额汇总 + 备注 -->
      <div v-show="currentStep === 1" class="step-panel" data-tutorial="items">
        <ItemTable :quotation-id="quotation.id" :items="quotation.items" />
        <el-row :gutter="20" style="margin-top: 16px">
          <el-col :xs="24" :lg="8">
            <div class="card section-card">
              <h3 class="section-title">备注</h3>
              <el-input v-model="quotation.notes" type="textarea" :rows="4" placeholder="输入备注信息..." />
            </div>
          </el-col>
          <el-col :xs="24" :lg="16" data-tutorial="summary">
            <SummaryPanel :quotation="quotation" />
          </el-col>
        </el-row>
      </div>

      <!-- 步骤3: 模板市场 -->
      <div v-show="currentStep === 2" class="step-panel" data-tutorial="templates">
        <div class="card section-card">
          <h3 class="section-title">选择模板</h3>
          <TemplateMarket v-model="quotation.templateId" :templates="templates" />
        </div>
      </div>

      <!-- 步骤4: 预览导出 -->
      <div v-show="currentStep === 3" class="step-panel" data-tutorial="preview">
        <div class="preview-toolbar">
          <el-button @click="currentStep--">
            <el-icon><ArrowLeft /></el-icon> 返回修改
          </el-button>
          <div class="toolbar-spacer"></div>
          <el-button type="warning" @click="handleExportImage">
            <el-icon><Picture /></el-icon> 导出图片
          </el-button>
          <el-button type="danger" @click="handleExportPdf">
            <el-icon><Document /></el-icon> 导出PDF
          </el-button>
        </div>
        <div class="preview-wrapper">
          <QuotationPreview ref="previewComponent" :quotation="quotation" />
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div v-if="quotation" class="step-footer">
      <el-button v-if="currentStep > 0 && currentStep < 3" @click="currentStep--">
        <el-icon><ArrowLeft /></el-icon> 上一步
      </el-button>
      <div v-else></div>
      <el-button v-if="currentStep < 3" type="primary" @click="currentStep++">
        下一步 <el-icon><ArrowRight /></el-icon>
      </el-button>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuotationStore } from '@/stores/quotation'
import { useTemplateStore } from '@/stores/template'
import CompanyForm from '@/components/CompanyForm.vue'
import CustomerForm from '@/components/CustomerForm.vue'
import ItemTable from '@/components/ItemTable.vue'
import SummaryPanel from '@/components/SummaryPanel.vue'
import TemplateMarket from '@/components/TemplateMarket.vue'
import QuotationPreview from '@/components/QuotationPreview.vue'
import { ElMessage } from 'element-plus'
import { downloadFile } from '@/utils/helpers'
import { exportToPdf, exportToImage } from '@/utils/pdf'

const router = useRouter()
const route = useRoute()
const store = useQuotationStore()
const templateStore = useTemplateStore()
const templates = computed(() => templateStore.templates)

const currentStep = ref(0)

// 监听教程的编辑器子步骤控制
const tutorialEditorStep = inject<Ref<number>>('tutorialEditorStep')
if (tutorialEditorStep) {
  watch(tutorialEditorStep, (v) => {
    if (v >= 0 && v <= 3) {
      currentStep.value = v
    }
  })
}

const previewComponent = ref<InstanceType<typeof QuotationPreview>>()

const quotationId = route.params.id as string
const existing = store.getQuotation(quotationId)
const quotation = ref(existing || store.createQuotation())

function handleSave() {
  if (quotation.value) {
    store.updateQuotation(quotation.value.id, { ...quotation.value })
    ElMessage.success('已暂存到浏览器')
  }
}

async function handleExportPdf() {
  handleSave()
  const el = previewComponent.value?.$el
  if (el && quotation.value) {
    const result = await exportToPdf(el, `${quotation.value.quotationNo || '报价单'}.pdf`)
    if (result.success && result.path) {
      ElMessage.success('PDF 已保存到: ' + result.path)
    } else if (result.success) {
      ElMessage.success('PDF 已导出')
    }
  }
}

async function handleExportImage() {
  handleSave()
  const el = previewComponent.value?.$el
  if (el && quotation.value) {
    const result = await exportToImage(el, `${quotation.value.quotationNo || '报价单'}.png`)
    if (result.success && result.path) {
      ElMessage.success('图片已保存到: ' + result.path)
    } else if (result.success) {
      ElMessage.success('图片已导出')
    }
  }
}

async function handleSaveToLocal() {
  if (!quotation.value) return
  store.updateQuotation(quotation.value.id, { ...quotation.value })
  const json = JSON.stringify(quotation.value, null, 2)
  const filename = `${quotation.value.quotationNo || '报价单'}_${quotation.value.customer.name || '未命名'}.json`
  await downloadFile(json, filename, 'application/json')
  ElMessage.success('已保存到本地，请妥善保管文件')
}
</script>

<style lang="scss" scoped>
.basic-info-bar {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .bar-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeef5;
  }
  .bar-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bar-left {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
  }
  .field-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 140px;
  }
  .field-label {
    font-size: 12px;
    color: #909399;
    font-weight: 500;
  }
  .bar-right {
    display: flex;
    gap: 8px;
  }
}

.steps-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 20px 40px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.step-content {
  min-height: 400px;
}

.step-panel {
  animation: fadeIn 0.3s ease;
}

.step-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
}

.section-card {
  margin-bottom: 16px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
}

.preview-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}
.toolbar-spacer {
  flex: 1;
}

.preview-wrapper {
  background: #e8e8e8;
  padding: 32px;
  border-radius: 8px;
  overflow-x: auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
