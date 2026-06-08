import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppSettings } from '@/types'
import { loadData, saveData } from '@/utils/storage'

const defaultSettings: AppSettings = {
  defaultCompany: {
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: ''
  },
  defaultTaxRate: 13,
  defaultPaymentTerms: '预付30%，发货前付清余款',
  defaultTemplateId: 'simple',
  quotationNoPrefix: 'QT',
  quotationNoNext: 1
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>(loadData<AppSettings>('settings', defaultSettings))
  // 每次页面加载时重置编号计数器
  settings.value.quotationNoNext = 1

  function updateSettings(partial: Partial<AppSettings>) {
    Object.assign(settings.value, partial)
    saveData('settings', settings.value)
  }

  function updateDefaultCompany(company: Partial<AppSettings['defaultCompany']>) {
    Object.assign(settings.value.defaultCompany, company)
    saveData('settings', settings.value)
  }

  function getNextQuotationNo(): string {
    const no = `${settings.value.quotationNoPrefix}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(settings.value.quotationNoNext).padStart(3, '0')}`
    settings.value.quotationNoNext++
    saveData('settings', settings.value)
    return no
  }

  function resetSettings() {
    settings.value = { ...defaultSettings }
    saveData('settings', settings.value)
  }

  return { settings, updateSettings, updateDefaultCompany, getNextQuotationNo, resetSettings }
})
