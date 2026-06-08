<template>
  <Teleport to="body">
    <div v-if="visible" class="tutorial-overlay" @click.self="handleSkip">
      <!-- 高亮区域（仅当目标元素存在时显示） -->
      <div
        v-if="hasTarget"
        class="tutorial-spotlight"
        :style="spotlightStyle"
      />

      <!-- 提示卡片 -->
      <div
        class="tutorial-card"
        :class="{ 'tutorial-card--center': !hasTarget }"
        :style="hasTarget ? cardStyle : {}"
      >
        <div class="tutorial-header">
          <span class="tutorial-step-badge">{{ currentStepIndex + 1 }} / {{ steps.length }}</span>
          <button class="tutorial-skip" @click="handleSkip">跳过</button>
        </div>
        <h3 class="tutorial-title">{{ currentStep?.title }}</h3>
        <p class="tutorial-desc">{{ currentStep?.description }}</p>
        <div class="tutorial-footer">
          <el-button v-if="currentStepIndex > 0" size="small" @click="prev">上一步</el-button>
          <div v-else></div>
          <el-button v-if="currentStepIndex < steps.length - 1" type="primary" size="small" @click="next">
            下一步
          </el-button>
          <el-button v-else type="primary" size="small" @click="handleFinish">
            开始使用
          </el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '@/stores/quotation'

interface TutorialStep {
  target: string
  title: string
  description: string
  position?: 'top' | 'bottom'
  route: 'home' | 'editor'
  editorStep?: number // 编辑器子步骤 (0=公司客户, 1=项目明细, 2=模板市场, 3=预览)
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'finish': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const router = useRouter()
const store = useQuotationStore()
const tutorialEditorStep = inject<Ref<number>>('tutorialEditorStep')!

const steps: TutorialStep[] = [
  {
    target: '[data-tutorial="home-actions"]',
    title: '欢迎使用报价易',
    description: '在这里您可以「新建报价单」从头开始创建，或「从本地打开」之前保存的报价单文件继续编辑。数据仅保存在您的浏览器中，安全可靠。',
    position: 'bottom',
    route: 'home'
  },
  {
    target: '[data-tutorial="basic-info"]',
    title: '基本信息',
    description: '这里显示报价单的编号、日期、有效期和付款条件。编号自动生成，日期和付款条件可自由修改。此区域始终固定在顶部。',
    position: 'bottom',
    route: 'editor'
  },
  {
    target: '[data-tutorial="save-actions"]',
    title: '保存操作',
    description: '「保存到本地」将报价单导出为JSON文件，方便后续导入继续编辑。「暂存」将数据保存在浏览器中。',
    position: 'bottom',
    route: 'editor'
  },
  {
    target: '[data-tutorial="steps"]',
    title: '分步引导',
    description: '通过步骤条引导您完成报价单的填写：公司与客户 → 项目明细 → 模板市场 → 预览导出。',
    position: 'bottom',
    route: 'editor'
  },
  {
    target: '[data-tutorial="company-customer"]',
    title: '公司与客户信息',
    description: '填写您公司的信息和客户信息。公司信息会自动记忆，下次新建报价单时自动填充。',
    position: 'top',
    route: 'editor',
    editorStep: 0
  },
  {
    target: '[data-tutorial="items"]',
    title: '项目明细',
    description: '添加报价项目，支持手动输入和Excel批量导入。每个项目包含名称、规格、数量、单价等字段。',
    position: 'top',
    route: 'editor',
    editorStep: 1
  },
  {
    target: '[data-tutorial="summary"]',
    title: '金额汇总与备注',
    description: '系统自动计算小计、折扣、税额和总计。可设置折扣类型和税率，备注区域可补充说明。',
    position: 'top',
    route: 'editor',
    editorStep: 1
  },
  {
    target: '[data-tutorial="templates"]',
    title: '模板市场',
    description: '选择您喜欢的报价单模板风格，不同模板适用于不同行业和场景。',
    position: 'top',
    route: 'editor',
    editorStep: 2
  },
  {
    target: '[data-tutorial="preview"]',
    title: '预览与导出',
    description: '预览报价单最终效果，确认无误后可导出为PDF或图片。导出后数据不会自动清除，您可以继续编辑。',
    position: 'top',
    route: 'editor',
    editorStep: 3
  }
]

const currentStepIndex = ref(0)
const currentStep = computed(() => steps[currentStepIndex.value])
const hasTarget = ref(false)
const spotlightRect = ref({ top: 0, left: 0, width: 0, height: 0 })

const spotlightStyle = computed(() => {
  const r = spotlightRect.value
  const pad = 6
  return {
    top: `${r.top - pad}px`,
    left: `${r.left - pad}px`,
    width: `${r.width + pad * 2}px`,
    height: `${r.height + pad * 2}px`
  }
})

const cardStyle = computed(() => {
  const r = spotlightRect.value
  const pos = currentStep.value?.position || 'bottom'
  const cardW = 360
  let top = 0
  let left = 0

  if (pos === 'bottom') {
    top = r.top + r.height + 16
    left = r.left + r.width / 2 - cardW / 2
  } else if (pos === 'top') {
    top = r.top - 220
    left = r.left + r.width / 2 - cardW / 2
  }

  left = Math.max(16, Math.min(left, window.innerWidth - cardW - 16))
  top = Math.max(16, Math.min(top, window.innerHeight - 260))

  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${cardW}px`
  }
})

function findTarget(): HTMLElement | null {
  const selector = currentStep.value?.target
  if (!selector) return null
  return document.querySelector(selector) as HTMLElement | null
}

function updateSpotlight() {
  const el = findTarget()
  if (!el) {
    hasTarget.value = false
    return
  }
  hasTarget.value = true
  const rect = el.getBoundingClientRect()
  spotlightRect.value = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

let retryTimer: ReturnType<typeof setTimeout> | null = null

function waitForTarget(retries = 0): Promise<void> {
  return new Promise((resolve) => {
    if (retries > 30) {
      hasTarget.value = false
      resolve()
      return
    }
    const el = findTarget()
    if (el && el.offsetParent !== null) {
      updateSpotlight()
      resolve()
    } else {
      retryTimer = setTimeout(() => {
        waitForTarget(retries + 1).then(resolve)
      }, 150)
    }
  })
}

async function navigateToStep() {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }
  const step = currentStep.value
  if (!step) return

  // 控制编辑器子步骤
  if (step.editorStep !== undefined) {
    tutorialEditorStep.value = step.editorStep
  } else {
    tutorialEditorStep.value = -1
  }

  const currentRouteName = router.currentRoute.value.name as string
  const needRoute = step.route === 'home' ? 'home' : 'editor'

  if (needRoute === 'editor' && currentRouteName !== 'editor') {
    // 从首页进入编辑器，需要先创建报价单
    store.destroyAll()
    const q = store.createQuotation()
    await router.push(`/editor/${q.id}`)
    await waitForTarget()
  } else if (needRoute === 'home' && currentRouteName !== 'home') {
    // 从编辑器跳回首页，不导航（避免丢失数据），显示居中卡片
    hasTarget.value = false
  } else {
    // 已在正确页面，等待 v-show 面板切换后元素变为可见
    await waitForTarget()
  }
}

async function next() {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
    await navigateToStep()
  }
}

async function prev() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    await navigateToStep()
  }
}

function handleSkip() {
  cleanup()
  visible.value = false
  localStorage.setItem('tutorial_completed', 'true')
}

function handleFinish() {
  cleanup()
  visible.value = false
  localStorage.setItem('tutorial_completed', 'true')
  emit('finish')
  // 回到首页初始状态
  store.destroyAll()
  router.push('/')
}

function cleanup() {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }
}

watch(() => props.modelValue, async (v) => {
  if (v) {
    cleanup()
    // 根据当前所在页面决定起始步骤：编辑器页面跳过首页指引
    const currentRouteName = router.currentRoute.value.name
    currentStepIndex.value = currentRouteName === 'editor' ? 1 : 0
    await nextTick()
    await navigateToStep()
  }
})

let resizeHandler: () => void
onMounted(() => {
  resizeHandler = () => { if (visible.value && hasTarget.value) updateSpotlight() }
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('scroll', resizeHandler, true)
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', resizeHandler)
  window.removeEventListener('scroll', resizeHandler, true)
})
</script>

<style lang="scss" scoped>
.tutorial-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
}

.tutorial-spotlight {
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
  z-index: 10000;
  transition: all 0.3s ease;
  pointer-events: none;
}

.tutorial-card {
  position: absolute;
  z-index: 10001;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;

  &--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 360px;
  }
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tutorial-step-badge {
  font-size: 12px;
  font-weight: 600;
  color: #1e3a5f;
  background: #e8eef5;
  padding: 2px 10px;
  border-radius: 10px;
}

.tutorial-skip {
  background: none;
  border: none;
  color: #909399;
  font-size: 13px;
  cursor: pointer;
  padding: 2px 6px;
  &:hover { color: #606266; }
}

.tutorial-title {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 8px;
}

.tutorial-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  margin: 0 0 16px;
}

.tutorial-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>