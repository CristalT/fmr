import { describe, it, expect } from 'vitest'
import PdfGenerator from '#services/pdf_generator/pdf_generator'
import type CustomerUser from '#models/customer_user'

describe('PDF Generator', () => {
  it('initializes with an empty document definition', () => {
    const pdfGenerator = new PdfGenerator()

    expect(pdfGenerator.definition()).toEqual({
      content: [],
      pageSize: 'A4',
      styles: {
        tableHeader: {
          alignment: 'center',
          bold: true,
          color: 'black',
          fillColor: '#f3f3f3',
          fontSize: 10,
        },
        clientHeader: {
          margin: [0, 0, 0, 10],
        },
      },
    })
  })

  it('adds a header to the document', () => {
    const pdfGenerator = new PdfGenerator()
    pdfGenerator.docHeader({
      title: 'Test Document',
    })

    expect(pdfGenerator.definition().content.at(0)).toEqual([
      {
        text: 'Test Document',
        alignment: 'left',
        fontSize: 16,
        bold: true,
        border: [1, 1, 0, 0],
        margin: [0, 0, 0, 10],
      },
    ])
  })

  it('adds a client header with customer details', () => {
    const pdfGenerator = new PdfGenerator()

    const customer = {
      id: 1,
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      phone: '123-456-7890',
      email: 'test@email.com',
    } as CustomerUser

    pdfGenerator.clientHeader(customer)

    expect(pdfGenerator.definition().content.at(0)).toEqual({
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
  })

  it('creates a table with specified widths and header rows', () => {
    const pdfGenerator = new PdfGenerator()
    pdfGenerator.table((table) =>
      table
        .widths(['*', 'auto', 'auto'])
        .headerRows(1)
        .header([
          { text: 'Header 1', alignment: 'center' },
          { text: 'Header 2', alignment: 'center' },
          { text: 'Header 3', alignment: 'center' },
        ])
        .rows([
          { text: 'Row 1, Cell 1', alignment: 'left' },
          { text: 'Row 1, Cell 2', alignment: 'left' },
          { text: 'Row 1, Cell 3', alignment: 'left' },
        ])
    )

    expect(pdfGenerator.definition().content.at(0)).toEqual({
      table: {
        widths: ['*', 'auto', 'auto'],
        headerRows: 1,
        body: [
          [
            { text: 'Header 1', alignment: 'center', style: 'tableHeader' },
            { text: 'Header 2', alignment: 'center', style: 'tableHeader' },
            { text: 'Header 3', alignment: 'center', style: 'tableHeader' },
          ],
          [
            { text: 'Row 1, Cell 1', alignment: 'left' },
            { text: 'Row 1, Cell 2', alignment: 'left' },
            { text: 'Row 1, Cell 3', alignment: 'left' },
          ],
        ],
      },
    })
  })
})
