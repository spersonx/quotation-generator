import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(
  element: HTMLElement,
  filename: string = '报价单.pdf'
): Promise<void> {
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

  pdf.save(filename)
}

export async function exportToImage(
  element: HTMLElement,
  filename: string = '报价单.png'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
