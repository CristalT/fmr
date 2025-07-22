import type Order from '#models/order'
import PdfGenerator from '#services/pdf_generator/pdf_generator'
import { Readable } from 'node:stream'

export default class OrderPrinter {
  private order: Order

  constructor(order: Order) {
    this.order = order
  }

  async generatePDF() {
    const pdf = new PdfGenerator()

    pdf.docHeader({
      title: `Nota de Pedido #${this.order.id}`,
    })

    pdf.clientHeader(this.order.customerUser)

    pdf.table((table) => {
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

      this.order.cartItems.forEach((item) => {
        table.rows([
          { text: String(item.product.code), alignment: 'left' },
          { text: String(item.product.name), alignment: 'left' },
          { text: String(item.quantity), alignment: 'center' },
          { text: '', alignment: 'center' },
          { text: String(item.product.location), alignment: 'left' },
        ])
      })
    })

    return pdf.print() as unknown as Readable
  }
}
