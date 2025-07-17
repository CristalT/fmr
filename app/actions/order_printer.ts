import { Readable } from 'node:stream'
import { Printer } from '#actions/printer'
import Order from '#models/order'

type PrintableOrder = {
  id: string
  customer: {
    firstName: string
    lastName: string
  }
  items: Array<{
    code: string
    name: string
    quantity: string
  }>
}

export default class OrderPrinter extends Printer<Order> {
  private order!: PrintableOrder

  setData(order: Order): this {
    this.order = {
      id: String(order.id),
      customer: {
        firstName: order.customerUser.firstName,
        lastName: order.customerUser.lastName,
      },
      items: order.cartItems.map((item) => ({
        code: item.product.code,
        name: item.product.name,
        quantity: String(item.quantity),
      })),
    }

    return this
  }

  async generatePDF() {
    const doc = this.doc

    doc.fontSize(14)
    doc.text(`Pedido #${this.order.id}`, { align: 'center', underline: true })
    doc.moveDown()
    doc.fontSize(12)
    doc
      .table({ columnStyles: ['*', '*'] })
      .row([
        { text: 'Cliente:', padding: '0.5em', border: [1, 0, 0, 1] },
        {
          text: `${this.order.customer.firstName} ${this.order.customer.lastName}`,
          padding: '0.5em',
          border: [1, 1, 0, 0],
        },
      ])
      .row([
        { text: 'Fecha:', padding: '0.5em', border: [0, 0, 1, 1] },
        {
          text: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          padding: '0.5em',
          border: [0, 1, 1, 0],
        },
      ])

    doc.moveDown()
    doc.table({
      rowStyles: (i) => {
        return i < 1
          ? { border: [0, 0, 2, 0], borderColor: 'black' }
          : { border: [0, 0, 1, 0], borderColor: '#aaa' }
      },
      columnStyles: [80, '*', 50],
      data: [
        [
          { text: 'CODIGO', padding: '0.5em' },
          { text: 'DESCRIPCION', padding: '0.5em' },
          { text: 'CANT.', padding: '0.5em' },
        ],
        ...this.order.items.map((item) => [
          { text: item.code, padding: '0.5em' },
          { text: item.name, padding: '0.5em' },
          { text: item.quantity, padding: '0.5em' },
        ]),
      ],
    })

    doc.end()

    return doc as unknown as Readable
  }
}
