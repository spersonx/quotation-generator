export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export function generateQuotationNo(prefix: string, next: number): string {
  const now = new Date()
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('')
  return `${prefix}-${dateStr}-${String(next).padStart(3, '0')}`
}

export function formatMoney(value: number): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const CHINESE_NUMBERS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const CHINESE_UNITS = ['', '拾', '佰', '仟']
const CHINESE_BIG_UNITS = ['', '万', '亿', '万亿']

export function formatChineseMoney(value: number): string {
  if (value < 0 || value > 999999999999.99) return ''
  if (value === 0) return '零元整'
  
  const valueStr = Math.round(value * 100).toString()
  const intPart = valueStr.slice(0, -2) || '0'
  const decimalPart = valueStr.slice(-2)
  
  let result = ''
  
  // 整数部分
  const intNum = parseInt(intPart)
  if (intNum > 0) {
    let unitIndex = 0
    let num = intNum
    let needZero = false
    
    while (num > 0) {
      const segment = num % 10000
      if (segment > 0) {
        const segmentStr = formatSegmentChinese(segment) + (CHINESE_BIG_UNITS[unitIndex] || '')
        result = segmentStr + (needZero && segment < 1000 ? '零' : '') + result
        needZero = false
      } else {
        needZero = result.length > 0 && !result.startsWith('零')
      }
      num = Math.floor(num / 10000)
      unitIndex++
    }
    result += '元'
  }
  
  // 小数部分
  const jiao = parseInt(decimalPart[0])
  const fen = parseInt(decimalPart[1])
  
  if (jiao === 0 && fen === 0) {
    result += '整'
  } else {
    if (jiao > 0) result += CHINESE_NUMBERS[jiao] + '角'
    if (fen > 0) result += CHINESE_NUMBERS[fen] + '分'
  }
  
  return result
}

function formatSegmentChinese(num: number): string {
  const str = num.toString()
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i])
    if (digit !== 0) {
      result += CHINESE_NUMBERS[digit] + CHINESE_UNITS[str.length - 1 - i]
    } else {
      if (result.length > 0 && !result.endsWith('零') && i < str.length - 1) {
        result += '零'
      }
    }
  }
  if (result.endsWith('零')) result = result.slice(0, -1)
  return result
}

export function formatDate(date: string): string {
  if (!date) return ''
  return date
}

export function getToday(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export function getFutureDate(days: number): string {
  const now = new Date()
  now.setDate(now.getDate() + days)
  return now.toISOString().split('T')[0]
}

export function calculateQuotation(
  items: { quantity: number; price: number }[],
  discountType: 'percent' | 'fixed',
  discountValue: number,
  taxRate: number,
  taxIncluded: boolean
): { subtotal: number; discountAmount: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const discountAmount =
    discountType === 'percent' ? subtotal * (discountValue / 100) : discountValue

  const afterDiscount = subtotal - discountAmount

  let taxAmount: number
  let total: number

  if (taxIncluded) {
    total = afterDiscount
    taxAmount = total - total / (1 + taxRate / 100)
  } else {
    taxAmount = afterDiscount * (taxRate / 100)
    total = afterDiscount + taxAmount
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
