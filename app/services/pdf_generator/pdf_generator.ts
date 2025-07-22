import type CustomerUser from '#models/customer_user'
import Table from '#services/pdf_generator/table'
import { resolve } from 'node:path'
import PdfPrinter from 'pdfmake'

const fonts = {
  Roboto: {
    normal: resolve('fonts/Roboto_Condensed-Regular.ttf'),
    bold: resolve('fonts/Roboto_Condensed-Medium.ttf'),
    italics: resolve('fonts/Roboto_Condensed-Italic.ttf'),
    bolditalics: resolve('fonts/Roboto_Condensed-MediumItalic.ttf'),
  },
}

const printer = new PdfPrinter(fonts)

export default class PdfGenerator {
  private docDefinition: any

  constructor() {
    this.docDefinition = {
      pageSize: 'A4',
      content: [],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#f3f3f3',
          alignment: 'center',
        },
        clientHeader: {
          margin: [0, 0, 0, 10],
        },
      },
    }
  }

  docHeader(data: { title: string }) {
    this.docDefinition.content.push([
      {
        text: data.title,
        alignment: 'left',
        fontSize: 16,
        bold: true,
        border: [1, 1, 0, 0],
        margin: [0, 0, 0, 10],
      },
    ])
  }

  clientHeader(customer: CustomerUser) {
    this.docDefinition.content.push({
      style: 'clientHeader',
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: 'CLIENTE', colSpan: 2, alignment: 'center', fillColor: '#f3f3f3', bold: true },
            {},
          ],
          [
            {
              text: `${customer.id} - ${customer.fullName}`,
              colSpan: 2,
              bold: true,
              border: [1, 0, 1, 0],
            },
            {},
          ],
          [
            { text: customer.address, border: [1, 0, 0, 0] },
            { text: customer.city, border: [0, 0, 1, 0] },
          ],
          [
            { text: customer.phone, border: [1, 0, 0, 1] },
            { text: customer.email, border: [0, 0, 1, 1] },
          ],
        ],
      },
    })
    return this
  }

  table(callback: (table: Table) => void) {
    const table = new Table()
    callback(table)

    this.docDefinition.content.push(table.definition())
    return this
  }

  definition() {
    return this.docDefinition
  }

  print() {
    const pdf = printer.createPdfKitDocument(this.docDefinition)
    pdf.end()
    return pdf
  }
}
