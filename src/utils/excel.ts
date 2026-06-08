import * as XLSX from 'xlsx'
import type { QuotationItem } from '@/types'
import { generateId } from './helpers'

const FIELD_MAP: Record<string, keyof QuotationItem> = {
  '项目名称': 'name',
  '产品名称': 'name',
  '名称': 'name',
  '品名': 'name',
  '产品': 'name',
  '项目': 'name',
  '规格': 'description',
  '描述': 'description',
  '规格描述': 'description',
  '规格/描述': 'description',
  '单位': 'unit',
  '数量': 'quantity',
  '单价': 'price',
  '价格': 'price',
  '小计': 'amount'
}

function normalizeHeader(header: string): keyof QuotationItem | null {
  const trimmed = header.trim()
  return FIELD_MAP[trimmed] || null
}

export interface ImportResult {
  items: QuotationItem[]
  errors: string[]
}

export function parseExcelToItems(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet)

        if (rows.length === 0) {
          resolve({ items: [], errors: ['Excel 文件为空或没有数据行'] })
          return
        }

        const headers = Object.keys(rows[0])
        const fieldMap = new Map<string, keyof QuotationItem>()
        const errors: string[] = []

        for (const h of headers) {
          const field = normalizeHeader(h)
          if (field) {
            fieldMap.set(h, field)
          } else {
            errors.push(`未识别的列: "${h}"，将被忽略`)
          }
        }

        if (!fieldMap.has('name') && !fieldMap.values().next().value) {
          resolve({ items: [], errors: ['未找到"项目名称"列，请检查表头'] })
          return
        }

        const items: QuotationItem[] = []
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          const item: QuotationItem = {
            id: generateId(),
            index: i + 1,
            name: '',
            description: '',
            unit: '个',
            quantity: 1,
            price: 0,
            amount: 0
          }

          for (const [header, field] of fieldMap) {
            const val = row[header]
            if (val === undefined || val === null) continue

            if (field === 'name' || field === 'description' || field === 'unit') {
              item[field] = String(val).trim() as never
            } else if (field === 'quantity' || field === 'price' || field === 'amount') {
              const num = Number(val)
              if (!isNaN(num)) {
                item[field] = num as never
              }
            }
          }

          if (item.name) {
            item.amount = item.quantity * item.price
            items.push(item)
          } else {
            errors.push(`第 ${i + 2} 行缺少项目名称，已跳过`)
          }
        }

        items.forEach((item, idx) => { item.index = idx + 1 })
        resolve({ items, errors })
      } catch (err) {
        resolve({ items: [], errors: [`解析 Excel 失败: ${(err as Error).message}`] })
      }
    }
    reader.onerror = () => {
      resolve({ items: [], errors: ['读取文件失败'] })
    }
    reader.readAsArrayBuffer(file)
  })
}

export function downloadExcelTemplate(): void {
  const headers = ['项目名称', '规格/描述', '单位', '数量', '单价']
  const example1 = ['示例项目A', '100cm×50cm', '个', 10, 99.9]
  const example2 = ['示例项目B', '200cm×100cm', '套', 5, 199.9]

  const ws = XLSX.utils.aoa_to_sheet([headers, example1, example2])
  ws['!cols'] = [
    { wch: 20 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 12 }
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '项目明细')
  XLSX.writeFile(wb, '报价单导入模板.xlsx')
}
