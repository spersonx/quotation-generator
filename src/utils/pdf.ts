import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { saveFile } from './neutralino'
import type { SaveResult } from './neutralino'

export async function exportToPdf(
  element: HTMLElement,
  filename: string = '报价单.pdf'
): Promise<SaveResult> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  })

  const imgData = canvas.toDataURL('image/png')
  const imgWidth = canvas.width
  const imgHeight = canvas.height

  const pdfWidth = 210
  const pdfHeight = 297
  const margin = 0
  const contentWidth = pdfWidth - margin * 2
  const contentHeight = (imgHeight * contentWidth) / imgWidth

  const pdf = new jsPDF('p', 'mm', 'a4')

  let position = 0
  let remainingHeight = contentHeight

  if (contentHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', margin, 0, contentWidth, contentHeight)
  } else {
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
      remainingHeight -= pdfHeight
      if (remainingHeight > 0) {
        position -= pdfHeight
        pdf.addPage()
      }
    }
  }

  const pdfBlob = pdf.output('blob')
  return await saveFile(pdfBlob, filename, 'application/pdf')
}

export async function exportToImage(
  element: HTMLElement,
  filename: string = '报价单.png'
): Promise<SaveResult> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  })

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png')
  })
  return await saveFile(blob, filename, 'image/png')
}
