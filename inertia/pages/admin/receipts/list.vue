<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

import { AdminLayout } from '~/components'
import { Table, Button } from '~/components/ui'

import type Receipt from '#models/receipt'
import type { Meta } from '~/types/metadata'

import { friendlyDate } from '~/shared/utils'
import SearchField from '~/components/SearchField.vue'

const { results } = defineProps<{
  results: {
    data: Array<Receipt>
    meta: Meta
  }
}>()

const metadata = results.meta

const url = new URL(window.location.href)

const params = ref({
  search: url.searchParams.get('search') || '',
  page: metadata.currentPage || 1,
})

const data = results.data.map((receipt) => ({
  ...receipt,
  createdBy: receipt.author.fullName,
  paymentDate: friendlyDate(receipt.paymentDate),
  customer: receipt.customer.fullName,
  createdAt: friendlyDate(receipt.createdAt),
}))

const columns = [
  { key: 'id', label: '#' },
  { key: 'customer', label: 'Cliente' },
  { key: 'paymentDate', label: 'Fecha de Pago' },
  { key: 'createdAt', label: 'Fecha de Asiento' },
  { key: 'amount', label: 'Importe' },
  { key: 'createdBy', label: 'Responsable' },
]

function onPageChange(page: number) {
  params.value.page = page
  doFetch()
}

function onSearch(terms: string) {
  params.value.search = terms
  params.value.page = 1
  doFetch()
}

function doFetch() {
  router.get('/admin/receipts', params.value)
}
</script>
<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between">
        <h2 class="px-2 text-xl font-semibold">Recibos</h2>
        <Button label="Crear Recibo" @click="$inertia.get('/admin/receipts/create')" />
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <SearchField
        autofocus
        v-model:terms="params.search"
        v-model:page="params.page"
        @update:terms="onSearch" />

      <Table :data :columns :metadata @page-change="onPageChange" />
    </div>
  </AdminLayout>
</template>
