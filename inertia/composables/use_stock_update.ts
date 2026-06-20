import { ref } from 'vue'

export type StockUpdateMessage = { type: 'info' | 'error'; text: string }

export type StockUpdateResult = {
  success: boolean
  createdCount: number | null
  updatedCount: number | null
  deletedCount: number | null
  errorMessage: string | null
}

export default function useStockUpdate() {
  const running = ref(false)
  const messages = ref<StockUpdateMessage[]>([])

  async function run(): Promise<StockUpdateResult> {
    running.value = true
    messages.value = []

    try {
      const response = await fetch('/admin/dashboard/stock-update/run', { method: 'POST' })
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let result: StockUpdateResult = {
        success: false,
        createdCount: null,
        updatedCount: null,
        deletedCount: null,
        errorMessage: 'No se recibió respuesta del servidor',
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const event of events) {
          const json = event.replace(/^data: /, '').trim()
          if (!json) continue

          const data = JSON.parse(json)
          if (data.type === 'done') {
            result = data
          } else {
            messages.value.push(data)
          }
        }
      }

      return result
    } finally {
      running.value = false
    }
  }

  return { running, messages, run }
}
