// Neutralino 环境检测与文件保存兼容层

declare global {
  interface Window {
    Neutralino?: {
      init(): void
      filesystem: {
        writeFile(filename: string, data: string): Promise<void>
        writeBinaryFile(filename: string, data: ArrayBuffer): Promise<void>
      }
      os: {
        getEnv(key: string): Promise<string>
        showSaveDialog(title: string, defaultPath?: string, filters?: { name: string; extensions: string[] }[]): Promise<string>
      }
      debug: {
        log(message: string): Promise<void>
      }
    }
  }
}

let neutralinoReady = false

export function isNeutralino(): boolean {
  return typeof window !== 'undefined' && typeof window.Neutralino !== 'undefined'
}

export function initNeutralino(): void {
  if (isNeutralino()) {
    window.Neutralino!.init()
    neutralinoReady = true
    console.log('[Neutralino] 初始化成功')
  }
}

export function isNeutralinoReady(): boolean {
  return neutralinoReady
}

/**
 * 确保路径包含指定后缀
 */
function ensureExtension(path: string, ext: string): string {
  if (!ext) return path
  // 取路径最后一段的最后一个点
  const lastSlash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  const fileName = path.substring(lastSlash + 1)
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex === -1) {
    // 文件名没有任何后缀，直接补上
    return path + '.' + ext
  }
  // 有后缀但可能不匹配
  const existingExt = fileName.substring(dotIndex + 1).toLowerCase()
  if (existingExt !== ext.toLowerCase()) {
    // 后缀不匹配，替换为正确的后缀
    return path.substring(0, lastSlash + 1) + fileName.substring(0, dotIndex) + '.' + ext
  }
  return path
}

export interface SaveResult {
  success: boolean
  path?: string
}

/**
 * 保存文件：在 Neutralino 环境下使用原生文件对话框保存，
 * 在浏览器环境下回退到传统下载方式
 */
export async function saveFile(
  data: Blob | string | ArrayBuffer,
  filename: string,
  mimeType?: string
): Promise<SaveResult> {
  if (neutralinoReady && window.Neutralino!.os) {
    try {
      // 从原始文件名提取后缀，如 "报价单.pdf" -> "pdf"
      const lastDot = filename.lastIndexOf('.')
      const ext = lastDot >= 0 ? filename.substring(lastDot + 1) : ''

      const homeDir = await window.Neutralino!.os.getEnv('USERPROFILE').catch(() => '') || await window.Neutralino!.os.getEnv('HOME').catch(() => '')
      const defaultPath = homeDir ? `${homeDir}\\${filename}` : filename

      // 文件类型描述映射
      const typeLabels: Record<string, string> = {
        pdf: 'PDF 文件',
        png: 'PNG 图片',
        jpg: 'JPG 图片',
        xlsx: 'Excel 表格',
        json: 'JSON 文件',
      }
      const label = typeLabels[ext.toLowerCase()] || ext.toUpperCase()

      const savePath = await window.Neutralino!.os.showSaveDialog(
        '保存文件',
        defaultPath,
        [{ name: `${label} (*.${ext})`, extensions: [ext] }]
      )

      // 用户取消对话框时返回空字符串
      if (!savePath) return { success: false }

      // 确保路径包含正确后缀
      const finalPath = ensureExtension(savePath, ext)

      // 写入 Neutralino 日志
      if (window.Neutralino!.debug) {
        await window.Neutralino!.debug.log('[Neutralino] 保存文件到: ' + finalPath)
      }

      if (data instanceof Blob) {
        const buffer = await data.arrayBuffer()
        await window.Neutralino!.filesystem.writeBinaryFile(finalPath, buffer)
      } else if (data instanceof ArrayBuffer) {
        await window.Neutralino!.filesystem.writeBinaryFile(finalPath, data)
      } else {
        await window.Neutralino!.filesystem.writeFile(finalPath, data)
      }
      return { success: true, path: finalPath }
    } catch (e) {
      console.error('[Neutralino] 保存文件失败，回退到浏览器下载:', e)
      if (window.Neutralino!.debug) {
        await window.Neutralino!.debug.log('[Neutralino] 保存失败: ' + String(e))
      }
    }
  }

  // 浏览器回退：传统下载方式
  let blob: Blob
  if (data instanceof Blob) {
    blob = data
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: mimeType || 'application/octet-stream' })
  } else {
    blob = new Blob([data], { type: mimeType || 'text/plain' })
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return { success: true }
}
