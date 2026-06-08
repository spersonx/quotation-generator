import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template } from '@/types'
import { loadData, saveData } from '@/utils/storage'

const defaultTemplates: Template[] = [
  {
    id: 'simple',
    name: '简约',
    description: '干净利落，适合各类行业',
    style: {
      primaryColor: '#333333',
      fontFamily: "'SimSun', '宋体', serif",
      headerBg: '#ffffff',
      headerColor: '#333333',
      borderColor: '#dddddd',
      stripeBg: '#fafafa'
    }
  },
  {
    id: 'business',
    name: '商务蓝',
    description: '沉稳专业，彰显企业实力',
    style: {
      primaryColor: '#1a5276',
      fontFamily: "'SimSun', '宋体', serif",
      headerBg: '#1a5276',
      headerColor: '#ffffff',
      borderColor: '#1a5276',
      stripeBg: '#eaf2f8'
    }
  },
  {
    id: 'modern',
    name: '现代红',
    description: '大胆醒目，令人印象深刻',
    style: {
      primaryColor: '#e74c3c',
      fontFamily: "'SimSun', '宋体', serif",
      headerBg: '#e74c3c',
      headerColor: '#ffffff',
      borderColor: '#e74c3c',
      stripeBg: '#fdf2f2'
    }
  },
  {
    id: 'elegant',
    name: '雅致绿',
    description: '清新自然，温和亲切',
    style: {
      primaryColor: '#27ae60',
      fontFamily: "'SimSun', '宋体', serif",
      headerBg: '#27ae60',
      headerColor: '#ffffff',
      borderColor: '#27ae60',
      stripeBg: '#eafaf1'
    }
  },
  {
    id: 'luxury',
    name: '奢华金',
    description: '高端大气，适合精品行业',
    style: {
      primaryColor: '#b8860b',
      fontFamily: "'SimSun', '宋体', serif",
      headerBg: '#b8860b',
      headerColor: '#ffffff',
      borderColor: '#b8860b',
      stripeBg: '#fdf8ed'
    }
  }
]

export const useTemplateStore = defineStore('template', () => {
  const templates = ref<Template[]>(loadData<Template[]>('templates', defaultTemplates))

  function getTemplate(id: string): Template {
    return templates.value.find(t => t.id === id) || templates.value[0]
  }

  function addTemplate(template: Template) {
    templates.value.push(template)
    saveData('templates', templates.value)
  }

  function updateTemplate(id: string, data: Partial<Template>) {
    const idx = templates.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      Object.assign(templates.value[idx], data)
      saveData('templates', templates.value)
    }
  }

  function removeTemplate(id: string) {
    templates.value = templates.value.filter(t => t.id !== id)
    saveData('templates', templates.value)
  }

  function resetTemplates() {
    templates.value = [...defaultTemplates]
    saveData('templates', templates.value)
  }

  return { templates, getTemplate, addTemplate, updateTemplate, removeTemplate, resetTemplates }
})