import CustomerUser from '#models/customer_user'
import { Readable } from 'node:stream'

export default interface DocPrint {
  id: string | number
  header(): DocPrint
  customer(customer: CustomerUser): DocPrint
  items(items: Record<string, any>[]): DocPrint
  generatePDF(): Promise<Readable>
}
