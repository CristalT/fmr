<script setup lang="ts">
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'
import type { StockUpdateTrigger } from '#models/stock_update_run'
import { AdminLayout } from '~/components'
import { Alert, Card, Icon, Button } from '~/components/ui'
import { useStockUpdate, useToast } from '~/composables'

type StockUpdateRun = {
  id: number
  trigger: StockUpdateTrigger
  startedAt: string | null
  finishedAt: string | null
  success: boolean | null
  createdCount: number | null
  updatedCount: number | null
  deletedCount: number | null
  errorMessage: string | null
}

const { lastStockUpdateRun, lastStockUpdateRunWithChanges } = defineProps<{
  lastStockUpdateRun: StockUpdateRun | null
  lastStockUpdateRunWithChanges: StockUpdateRun | null
}>()

const { toast } = useToast()
const { running, messages, run } = useStockUpdate()

const lastRun = ref(lastStockUpdateRun)
const lastChangeRun = ref(lastStockUpdateRunWithChanges)

const isSuccess = computed(() => !!lastRun.value?.success)

const triggerLabel = computed(() =>
  lastRun.value?.trigger === 'manual' ? 'corrida manual' : 'corrida automática'
)

function absoluteDateTime(date: unknown) {
  if (!date) return ''
  return DateTime.fromISO(date.toString()).setLocale('es').toLocaleString(DateTime.DATETIME_SHORT)
}

function relativeDateTime(date: unknown) {
  if (!date) return 'Nunca'
  const relative = DateTime.fromISO(date.toString()).setLocale('es').toRelative() ?? ''
  return relative.charAt(0).toUpperCase() + relative.slice(1)
}

async function runNow() {
  const result = await run()
  const finishedAt = DateTime.now().toISO()

  lastRun.value = {
    ...lastRun.value,
    trigger: 'manual',
    success: result.success,
    errorMessage: result.errorMessage,
    finishedAt,
  } as StockUpdateRun

  const hasChanges =
    (result.createdCount ?? 0) > 0 || (result.updatedCount ?? 0) > 0 || (result.deletedCount ?? 0) > 0

  if (result.success && hasChanges) {
    lastChangeRun.value = {
      ...lastChangeRun.value,
      createdCount: result.createdCount,
      updatedCount: result.updatedCount,
      deletedCount: result.deletedCount,
      finishedAt,
    } as StockUpdateRun
  }

  if (result.success) {
    toast.success('Actualización de stock completada con éxito')
  } else {
    toast.error('La actualización de stock terminó con errores')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-2xl">
      <Card>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-bold text-gray-900">Actualización de stock</h1>
            <span
              v-if="lastRun"
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              :class="isSuccess ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-600'">
              <Icon :name="isSuccess ? 'check' : 'exclamation'" size="xs" />
              {{ isSuccess ? 'Exitosa' : 'Con errores' }}
            </span>
          </div>
        </template>

        <div v-if="!lastRun" class="py-2 text-gray-600">Todavía no se ejecutó el proceso.</div>

        <div v-else class="flex flex-col gap-5">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Última corrida
              </p>
              <p
                class="mt-1 text-base font-semibold text-gray-900"
                :title="absoluteDateTime(lastRun.finishedAt)">
                {{ relativeDateTime(lastRun.finishedAt) }}
              </p>
              <p class="text-xs text-gray-500">{{ triggerLabel }}</p>
            </div>

            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Última actualización con cambios
              </p>
              <p
                class="mt-1 text-base font-semibold text-gray-900"
                :title="lastChangeRun ? absoluteDateTime(lastChangeRun.finishedAt) : ''">
                {{ relativeDateTime(lastChangeRun?.finishedAt) }}
              </p>
            </div>
          </div>

          <Alert v-if="lastRun.errorMessage" variant="danger" class="!my-0 text-sm">
            {{ lastRun.errorMessage }}
          </Alert>

          <div v-if="lastChangeRun" class="grid grid-cols-3 gap-3">
            <div class="flex flex-col items-center gap-1 rounded-lg bg-secondary/10 py-3">
              <span class="text-2xl font-bold text-secondary">{{ lastChangeRun.createdCount }}</span>
              <span class="text-xs text-gray-600">Creados</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg bg-primary/10 py-3">
              <span class="text-2xl font-bold text-primary">{{ lastChangeRun.updatedCount }}</span>
              <span class="text-xs text-gray-600">Modificados</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg bg-amber-50 py-3">
              <span class="text-2xl font-bold text-amber-600">{{ lastChangeRun.deletedCount }}</span>
              <span class="text-xs text-gray-600">Eliminados</span>
            </div>
          </div>
          <p v-else class="text-sm italic text-gray-500">Todavía no se registraron cambios.</p>

          <div class="flex flex-col gap-2 border-t pt-4">
            <Button
              :label="running ? 'Corriendo...' : 'Correr ahora'"
              :disabled="running"
              full
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
        </div>
      </Card>
    </div>
  </AdminLayout>
</template>
