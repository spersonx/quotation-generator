<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-left" @click="handleGoHome">
        <div class="nav-seal">报</div>
        <span class="app-title">报价<em>易</em></span>
      </div>
      <div class="header-right">
        <el-tooltip content="使用指引" placement="bottom">
          <el-button :icon="QuestionFilled" circle size="small" @click="showTutorial = true" />
        </el-tooltip>
      </div>
    </el-header>
    <el-main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    <TutorialGuide v-model="showTutorial" />
  </el-container>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { useQuotationStore } from '@/stores/quotation'
import TutorialGuide from '@/components/TutorialGuide.vue'

const router = useRouter()
const store = useQuotationStore()
const showTutorial = ref(false)
const tutorialEditorStep = ref(-1) // -1 = 不控制编辑器步骤

provide('showTutorial', showTutorial)
provide('tutorialEditorStep', tutorialEditorStep)

async function handleGoHome() {
  try {
    await ElMessageBox.confirm(
      '返回首页将重置所有数据，确定继续吗？',
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    store.destroyAll()
    router.push('/')
  } catch {
    // 取消
  }
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  e.preventDefault()
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #303133;
  .nav-seal {
    width: 32px; height: 32px;
    border: 2px solid #1e3a5f;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'ZCOOL XiaoWei', 'SimSun', '宋体', serif;
    font-size: 16px; color: #1e3a5f;
    line-height: 1;
  }
  .app-title {
    font-size: 18px;
    font-weight: 600;
    font-family: 'ZCOOL XiaoWei', 'SimSun', '宋体', serif;
    em {
      font-style: normal;
      color: #1e3a5f;
    }
  }
}
.header-right {
  display: flex;
  align-items: center;
}
.app-main {
  background: #f5f7fa;
  padding: 24px;
  overflow-y: auto;
}
</style>
