export default class Table {
  private tableDefinition: any
  constructor() {
    this.tableDefinition = {
      table: {
        body: [],
      },
    }
  }

  widths(widths: (string | number)[]) {
    this.tableDefinition.table.widths = widths
    return this
  }

  headerRows(headerRows: number) {
    this.tableDefinition.table.headerRows = headerRows
    return this
  }

  header(row: { text: string; alignment?: string }[]) {
    const headerRow = row.map((cell) => ({
      ...cell,
      style: 'tableHeader',
    }))
    this.tableDefinition.table.body.push(headerRow)
    return this
  }

  rows(content: { text: string; alignment?: string; style?: string }[]) {
    const formattedRows = content.map((row) => ({ ...row, fontSize: 10 }))
    this.tableDefinition.table.body.push(formattedRows)
    return this
  }

  definition() {
    return this.tableDefinition
  }
}
