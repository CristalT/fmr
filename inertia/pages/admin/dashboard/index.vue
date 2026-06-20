<script setup lang="ts">
import { ref } from 'vue'
import { DateTime } from 'luxon'
import type StockUpdateRun from '#models/stock_update_run'
import { AdminLayout } from '~/components'
import { Card, Button } from '~/components/ui'
import { useStockUpdate, useToast } from '~/composables'

const { lastStockUpdateRun } = defineProps<{ lastStockUpdateRun: StockUpdateRun | null }>()

const { toast } = useToast()
const { running, messages, run } = useStockUpdate()

const lastRun = ref(lastStockUpdateRun)

function formatDateTime(date: unknown) {
  if (!date) return ''
  return DateTime.fromISO(date.toString()).setLocale('es').toLocaleString(DateTime.DATETIME_SHORT)
}

async function runNow() {
  const result = await run()

  lastRun.value = {
    ...lastRun.value,
    success: result.success,
    createdCount: result.createdCount,
    updatedCount: result.updatedCount,
    deletedCount: result.deletedCount,
    errorMessage: result.errorMessage,
    finishedAt: DateTime.now().toISO(),
  } as StockUpdateRun

  if (result.success) {
    toast.success('Actualización de stock completada con éxito')
  } else {
    toast.error('La actualización de stock terminó con errores')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="grid gap-4 md:grid-cols-2">
      <Card title="Actualización de stock">
        <div v-if="!lastRun" class="text-gray-600">Todavía no se ejecutó el proceso.</div>
        <div v-else class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Última actualización</span>
            <span>{{ formatDateTime(lastRun.finishedAt) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Resultado</span>
            <span
              class="rounded px-2 py-0.5 text-xs font-semibold text-white"
              :class="lastRun.success ? 'bg-green-600' : 'bg-red-600'">
              {{ lastRun.success ? 'EXITOSA' : 'ERROR' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Creados</span>
            <span>{{ lastRun.createdCount ?? '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Actualizados</span>
            <span>{{ lastRun.updatedCount ?? '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Eliminados</span>
            <span>{{ lastRun.deletedCount ?? '-' }}</span>
          </div>
          <p v-if="lastRun.errorMessage" class="text-sm text-red-600">{{ lastRun.errorMessage }}</p>
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <Button
            :label="running ? 'Corriendo...' : 'Correr ahora'"
            :disabled="running"
            @click="runNow" />

          <div
            v-if="messages.length"
            class="h-40 overflow-y-auto rounded bg-gray-900 p-2 font-mono text-xs text-gray-100">
            <div
              v-for="(message, index) of messages"
              :key="index"
              :class="message.type === 'error' ? 'text-red-400' : 'text-gray-200'">
              {{ message.text }}
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AdminLayout>
</template>
