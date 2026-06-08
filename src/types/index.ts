export interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  logo: string
}

export interface CustomerInfo {
  name: string
  contact: string
  address: string
  phone: string
  email: string
}

export interface QuotationItem {
  id: string
  index: number
  name: string
  description: string
  unit: string
  quantity: number
  price: number
  amount: number
}

export interface Quotation {
  id: string
  quotationNo: string
  status: 'draft' | 'sent'
  date: string
  validUntil: string
  paymentTerms: string
  company: CompanyInfo
  customer: CustomerInfo
  items: QuotationItem[]
  discountType: 'percent' | 'fixed'
  discountValue: number
  taxRate: number
  taxIncluded: boolean
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  notes: string
  templateId: string
  createdAt: string
  updatedAt: string
}

export interface TemplateStyle {
  primaryColor: string
  fontFamily: string
  headerBg: string
  headerColor: string
  borderColor: string
  stripeBg: string
}

export interface Template {
  id: string
  name: string
  description?: string
  style: TemplateStyle
}

export interface AppSettings {
  defaultCompany: CompanyInfo
  defaultTaxRate: number
  defaultPaymentTerms: string
  defaultTemplateId: string
  quotationNoPrefix: string
  quotationNoNext: number
}

export interface ProductLibraryItem {
  id: string
  name: string
  description: string
  unit: string
  price: number
}
