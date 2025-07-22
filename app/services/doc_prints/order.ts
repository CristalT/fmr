import type CustomerUser from '#models/customer_user'
import PdfGenerator from '#services/pdf_generator/pdf_generator'
import type DocPrint from '#services/doc_prints/doc'
import { Readable } from 'node:stream'

export default class OrderPrint implements DocPrint {
  public id: string | number

  private pdf: PdfGenerator

  constructor(id: string | number) {
    this.id = id
    this.pdf = new PdfGenerator()

    this.header()
  }

  header() {
    this.pdf.docHeader({
      title: `Nota de Pedido #${this.id}`,
    })
    return this
  }

  customer(customer: CustomerUser) {
    this.pdf.clientHeader(customer)
    return this
  }

  items(items: Record<string, any>[]) {
    this.pdf.table((table) => {
      table
        .widths([60, '*', 50, 50, 80])
        .headerRows(1)
        .header([
          { text: 'CODIGO', alignment: 'left' },
          { text: 'DESCRIPCION', alignment: 'left' },
          { text: 'PED.', alignment: 'center' },
          { text: 'ENT.', alignment: 'center' },
          { text: 'UBICACION', alignment: 'left' },
        ])

      items.forEach((item) => {
        table.rows([
          { text: String(item.code), alignment: 'left' },
          { text: String(item.name), alignment: 'left' },
          { text: String(item.quantity), alignment: 'center' },
          { text: '', alignment: 'center' }, // Placeholder for delivery
          { text: String(item.location), alignment: 'left' },
        ])
      })
    })
    return this
  }

  async generatePDF() {
    return this.pdf.print() as unknown as Readable
  }
}
