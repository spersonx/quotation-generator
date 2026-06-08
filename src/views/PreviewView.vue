<template>
  <div class="page-container">
    <div class="page-header">
      <h2>报价单预览</h2>
      <div class="header-actions">
        <el-button @click="handleBackToEditor">
          <el-icon><Edit /></el-icon> 返回修改
        </el-button>
        <el-button type="warning" @click="handleExportImage">
          <el-icon><Picture /></el-icon> 导出图片
        </el-button>
        <el-button type="danger" @click="handleExportPdf">
          <el-icon><Document /></el-icon> 导出PDF
        </el-button>
      </div>
    </div>

    <div v-if="quotation" class="preview-wrapper">
      <QuotationPreview ref="previewComponent" :quotation="quotation" />
    </div>
    <el-empty v-else description="报价单不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationStore } from '@/stores/quotation'
import { exportToPdf, exportToImage } from '@/utils/pdf'
import QuotationPreview from '@/components/QuotationPreview.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useQuotationStore()
const previewComponent = ref<InstanceType<typeof QuotationPreview>>()

const quotationId = computed(() => route.params.id as string)
const quotation = computed(() => store.getQuotation(quotationId.value))

async function handleExportPdf() {
  const el = previewComponent.value?.$el
  if (el) {
    const result = await exportToPdf(el, `${quotation.value?.quotationNo || '报价单'}.pdf`)
    if (result.success && result.path) {
      ElMessage.success('PDF 已保存到: ' + result.path)
    } else if (result.success) {
      ElMessage.success('PDF 已导出')
    }
  }
}

async function handleExportImage() {
  const el = previewComponent.value?.$el
  if (el) {
    const result = await exportToImage(el, `${quotation.value?.quotationNo || '报价单'}.png`)
    if (result.success && result.path) {
      ElMessage.success('图片已保存到: ' + result.path)
    } else if (result.success) {
      ElMessage.success('图片已导出')
    }
  }
}

function handleBackToEditor() {
  if (quotation.value) {
    router.push(`/editor/${quotation.value.id}`)
  } else {
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.preview-wrapper {
  background: #e8e8e8;
  padding: 32px;
  border-radius: 8px;
  overflow-x: auto;
}
.header-actions {
  display: flex;
  gap: 8px;
}
</style>
