import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quotation, QuotationItem } from '@/types'
import { loadData, saveData } from '@/utils/storage'
import { generateId, getToday, getFutureDate, calculateQuotation } from '@/utils/helpers'
import { useSettingsStore } from './settings'

function createEmptyItem(index: number): QuotationItem {
  return {
    id: generateId(),
    index,
    name: '',
    description: '',
    unit: '个',
    quantity: 1,
    price: 0,
    amount: 0
  }
}

function createEmptyQuotation(): Quotation {
  const settingsStore = useSettingsStore()
  const s = settingsStore.settings
  return {
    id: generateId(),
    quotationNo: '',
    status: 'draft',
    date: getToday(),
    validUntil: getFutureDate(30),
    paymentTerms: s.defaultPaymentTerms,
    company: { ...s.defaultCompany },
    customer: { name: '', contact: '', address: '', phone: '', email: '' },
    items: [createEmptyItem(1)],
    discountType: 'percent',
    discountValue: 0,
    taxRate: s.defaultTaxRate,
    taxIncluded: false,
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    templateId: s.defaultTemplateId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export const useQuotationStore = defineStore('quotation', () => {
  const quotations = ref<Quotation[]>(loadData<Quotation[]>('quotations', []))

  const sortedQuotations = computed(() => {
    return [...quotations.value].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  })

  function persist() {
    saveData('quotations', quotations.value)
  }

  function getQuotation(id: string): Quotation | undefined {
    return quotations.value.find(q => q.id === id)
  }

  function createQuotation(): Quotation {
    const settingsStore = useSettingsStore()
    const q = createEmptyQuotation()
    q.quotationNo = settingsStore.getNextQuotationNo()
    quotations.value.push(q)
    persist()
    return q
  }

  function updateQuotation(id: string, data: Partial<Quotation>) {
    const q = getQuotation(id)
    if (q) {
      Object.assign(q, data, { updatedAt: new Date().toISOString() })
      recalculate(id)
      persist()
    }
  }

  function deleteQuotation(id: string) {
    quotations.value = quotations.value.filter(q => q.id !== id)
    persist()
  }

  function duplicateQuotation(id: string): Quotation | undefined {
    const source = getQuotation(id)
    if (!source) return undefined
    const settingsStore = useSettingsStore()
    const dup: Quotation = {
      ...JSON.parse(JSON.stringify(source)),
      id: generateId(),
      quotationNo: settingsStore.getNextQuotationNo(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    quotations.value.push(dup)
    persist()
    return dup
  }

  function addItem(quotationId: string) {
    const q = getQuotation(quotationId)
    if (q) {
      q.items.push(createEmptyItem(q.items.length + 1))
      recalculate(quotationId)
      persist()
    }
  }

  function removeItem(quotationId: string, itemId: string) {
    const q = getQuotation(quotationId)
    if (q) {
      q.items = q.items.filter(i => i.id !== itemId)
      q.items.forEach((item, idx) => { item.index = idx + 1 })
      recalculate(quotationId)
      persist()
    }
  }

  function updateItem(quotationId: string, itemId: string, data: Partial<QuotationItem>) {
    const q = getQuotation(quotationId)
    if (q) {
      const item = q.items.find(i => i.id === itemId)
      if (item) {
        Object.assign(item, data)
        item.amount = item.quantity * item.price
        recalculate(quotationId)
        persist()
      }
    }
  }

  function recalculate(id: string) {
    const q = getQuotation(id)
    if (!q) return
    const calc = calculateQuotation(
      q.items,
      q.discountType,
      q.discountValue,
      q.taxRate,
      q.taxIncluded
    )
    q.subtotal = calc.subtotal
    q.discountAmount = calc.discountAmount
    q.taxAmount = calc.taxAmount
    q.total = calc.total
  }

  function destroyAll() {
    quotations.value = []
    persist()
  }

  function importQuotation(data: Quotation) {
    quotations.value.push(data)
    persist()
  }

  return {
    quotations,
    sortedQuotations,
    getQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    duplicateQuotation,
    addItem,
    removeItem,
    updateItem,
    recalculate,
    destroyAll,
    importQuotation
  }
})
