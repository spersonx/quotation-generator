<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-seal">报</div>
      <h1>报价易</h1>
      <p>专业报价，一键即达。<br>用报价易快速生成报价单</p>
    </div>
    <div class="actions" data-tutorial="home-actions">
      <el-card shadow="hover" class="action-card" @click="handleCreate" data-tutorial="home-create">
        <el-icon :size="36" color="#1e3a5f"><Plus /></el-icon>
        <h3>新建报价单</h3>
        <p>从零开始创建一份新的报价单</p>
      </el-card>
      <el-card shadow="hover" class="action-card" @click="triggerOpen" data-tutorial="home-open">
        <el-icon :size="36" color="#5b7a5e"><FolderOpened /></el-icon>
        <h3>从本地打开</h3>
        <p>导入之前保存的报价单文件</p>
        <input ref="fileInput" type="file" accept=".json" style="display:none" @change="handleOpen" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '@/stores/quotation'
import { ElMessage } from 'element-plus'
import type { Quotation } from '@/types'

const router = useRouter()
const store = useQuotationStore()
const fileInput = ref<HTMLInputElement>()

function handleCreate() {
  store.destroyAll()
  const q = store.createQuotation()
  router.push(`/editor/${q.id}`)
}

function triggerOpen() {
  fileInput.value?.click()
}

function handleOpen(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string)
      if (!data.id || !data.quotationNo) {
        ElMessage.error('文件格式不正确，请选择有效的报价单文件')
        return
      }
      store.destroyAll()
      store.importQuotation(data as Quotation)
      router.push(`/editor/${data.id}`)
      ElMessage.success('报价单已打开')
    } catch {
      ElMessage.error('文件解析失败，请检查文件格式')
    }
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

// 首次使用自动触发教程
const showTutorial = inject<Ref<boolean>>('showTutorial')
onMounted(() => {
  if (showTutorial && !localStorage.getItem('tutorial_completed')) {
    setTimeout(() => {
      showTutorial.value = true
    }, 600)
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 108px);
}
.hero {
  text-align: center;
  margin-bottom: 48px;
  .hero-seal {
    width: 64px; height: 64px;
    border: 3px solid #1e3a5f;
    border-radius: 6px;
    display: inline-flex; align-items: center; justify-content: center;
    font-family: 'ZCOOL XiaoWei', 'SimSun', '宋体', serif;
    font-size: 32px; color: #1e3a5f;
    line-height: 1;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #303133;
    margin: 0 0 8px;
    font-family: 'ZCOOL XiaoWei', 'SimSun', '宋体', serif;
  }
  p {
    font-size: 16px;
    color: #909399;
  }
}
.actions {
  display: flex;
  gap: 24px;
}
.action-card {
  width: 240px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  h3 {
    font-size: 18px;
    margin: 12px 0 8px;
    color: #303133;
  }
  p {
    font-size: 13px;
    color: #909399;
  }
}
</style>
