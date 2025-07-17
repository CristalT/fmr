import Order from '#models/order'
import PdfPrinter from 'pdfmake'
import type Product from '#models/product'
import { resolve } from 'node:path'
import { Readable } from 'node:stream'
import { TDocumentDefinitions } from 'pdfmake/interfaces.js'

const fonts = {
  Roboto: {
    normal: resolve('./fonts/Roboto_Condensed-Regular.ttf'),
    bold: resolve('./fonts/Roboto_Condensed-Medium.ttf'),
    italics: resolve('./fonts/Roboto_Condensed-Italic.ttf'),
    bolditalics: resolve('./fonts/Roboto_Condensed-MediumItalic.ttf'),
  },
}

const printer = new PdfPrinter(fonts)

type PrintableOrder = {
  id: string
  customer: {
    firstName: string
    lastName: string
  }
  items: Array<Partial<Product> & { quantity: string }>
}

export default class OrderPrinter {
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
        location: item.product.location || '',
      })),
    }

    return this
  }

  async generatePDF() {
    const items = this.order.items.map((item) => [
      [{ text: item.code, alignment: 'left' }],
      [{ text: item.name, alignment: 'left' }],
      [{ text: item.quantity, alignment: 'center' }],
      [{ text: item.location, alignment: 'left' }],
    ])
    const dd = {
      pageSize: 'A4',
      content: [
        {
          text: `Pedido #${this.order.id}`,
          style: 'header',
          alignment: 'left',
        },
        {
          text: `${this.order.customer.firstName} ${this.order.customer.lastName}`,
          style: 'subheader',
          alignment: 'left',
        },
        {
          text: `Fecha: ${new Date().toLocaleDateString()}`,
          style: 'subheader',
          alignment: 'left',
        },
        {
          table: {
            widths: [60, '*', 50, 100],
            headerRows: 1,
            body: [
              [
                { text: 'CODIGO', style: 'tableHeader', alignment: 'left' },
                { text: 'DESCRIPCION', style: 'tableHeader', alignment: 'left' },
                { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
                { text: 'UBICACION', style: 'tableHeader', alignment: 'left' },
              ],
              ...items,
            ],
          },
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#f3f3f3',
          alignment: 'center',
        },
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 15],
        },
      },
    }
    const doc = printer.createPdfKitDocument(dd as unknown as TDocumentDefinitions)
    doc.end()
    return doc as unknown as Readable
  }
}
