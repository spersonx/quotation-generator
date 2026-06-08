const PREFIX = 'qg_'

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data))
  } catch (e) {
    console.error('localStorage save failed:', e)
  }
}

export function removeData(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(PREFIX)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || '')
      } catch {
        data[key] = localStorage.getItem(key)
      }
    }
  }
  return JSON.stringify(data, null, 2)
}

export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json) as Record<string, unknown>
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    }
    return true
  } catch {
    return false
  }
}
