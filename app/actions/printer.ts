import { Readable } from 'node:stream'
import PDFDocument from 'pdfkit'

export abstract class Printer<T> {
  protected doc: PDFKit.PDFDocument

  constructor() {
    this.doc = new PDFDocument()
  }
  abstract setData(data: T): this
  abstract generatePDF(): Promise<Readable>
}
