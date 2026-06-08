<template>
  <div class="card section-card">
    <div class="section-header">
      <h3 class="section-title">项目明细</h3>
      <div class="header-btns">
        <el-button size="small" @click="handleDownloadTemplate">
          <el-icon><Download /></el-icon> 下载模板
        </el-button>
        <el-button type="warning" size="small" @click="triggerImport">
          <el-icon><Upload /></el-icon> 导入Excel
        </el-button>
        <el-button type="primary" size="small" @click="handleAdd">
          <el-icon><Plus /></el-icon> 添加项目
        </el-button>
        <input ref="excelInput" type="file" accept=".xlsx,.xls,.csv" style="display:none" @change="handleExcelImport" />
      </div>
    </div>
    <el-table :data="items" border style="width: 100%" size="small">
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="160">
        <template #default="{ row }">
          <el-input v-model="row.name" size="small" placeholder="项目名称" @change="handleChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="规格/描述" min-width="140">
        <template #default="{ row }">
          <el-input v-model="row.description" size="small" placeholder="规格描述" @change="handleChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="单位" width="80">
        <template #default="{ row }">
          <el-input v-model="row.unit" size="small" @change="handleChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="数量" width="150">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" size="small" :min="0" :precision="2" controls-position="right" @change="handleChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="单价" width="150">
        <template #default="{ row }">
          <el-input-number v-model="row.price" size="small" :min="0" :precision="2" controls-position="right" @change="handleChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="小计" width="110" align="right">
        <template #default="{ row }">
          <span class="amount-text">¥{{ formatMoney(row.amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" align="center">
        <template #default="{ row }">
          <el-button type="danger" text size="small" @click="handleRemove(row.id)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="importDialogVisible" title="Excel 导入结果" width="500px">
      <div v-if="importResult">
        <el-alert
          v-if="importResult.items.length > 0"
          :title="`成功导入 ${importResult.items.length} 条项目`"
          type="success"
          show-icon
          :closable="false"
          style="margin-bottom: 12px"
        />
        <el-alert
          v-if="importResult.errors.length > 0"
          title="导入过程中有以下提示："
          type="warning"
          show-icon
          :closable="false"
        >
          <ul class="import-errors">
            <li v-for="(err, idx) in importResult.errors" :key="idx">{{ err }}</li>
          </ul>
        </el-alert>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!importResult || importResult.items.length === 0"
          @click="confirmImport"
        >
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QuotationItem } from '@/types'
import { useQuotationStore } from '@/stores/quotation'
import { formatMoney } from '@/utils/helpers'
import { parseExcelToItems, downloadExcelTemplate, type ImportResult } from '@/utils/excel'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  quotationId: string
  items: QuotationItem[]
}>()

const store = useQuotationStore()
const excelInput = ref<HTMLInputElement>()
const importDialogVisible = ref(false)
const importResult = ref<ImportResult | null>(null)

function handleAdd() {
  store.addItem(props.quotationId)
}

function handleRemove(itemId: string) {
  store.removeItem(props.quotationId, itemId)
}

function handleChange(item: QuotationItem) {
  store.updateItem(props.quotationId, item.id, {
    name: item.name,
    description: item.description,
    unit: item.unit,
    quantity: item.quantity,
    price: item.price
  })
}

function triggerImport() {
  excelInput.value?.click()
}

async function handleExcelImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const result = await parseExcelToItems(file)
  importResult.value = result
  importDialogVisible.value = true

  ;(e.target as HTMLInputElement).value = ''
}

function confirmImport() {
  if (!importResult.value || importResult.value.items.length === 0) return

  for (const item of importResult.value.items) {
    store.addItem(props.quotationId)
    const q = store.getQuotation(props.quotationId)
    if (q) {
      const lastItem = q.items[q.items.length - 1]
      store.updateItem(props.quotationId, lastItem.id, {
        name: item.name,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price
      })
    }
  }

  ElMessage.success(`成功导入 ${importResult.value.items.length} 条项目`)
  importDialogVisible.value = false
  importResult.value = null
}

async function handleDownloadTemplate() {
  await downloadExcelTemplate()
  ElMessage.success('模板已下载')
}
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.header-btns {
  display: flex;
  gap: 8px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.amount-text {
  font-weight: 600;
  color: #409eff;
}
.import-errors {
  margin: 4px 0 0;
  padding-left: 18px;
  font-size: 13px;
  li {
    margin-bottom: 2px;
  }
}
</style>
