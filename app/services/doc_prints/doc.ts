import Customer from '#models/customer'
import { Readable } from 'node:stream'

export default interface DocPrint {
  id: string | number
  header(): DocPrint
  customer(customer: Customer): DocPrint
  items(items: Record<string, any>[]): DocPrint
  generatePDF(): Promise<Readable>
}
