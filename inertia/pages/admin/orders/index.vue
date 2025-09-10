<script lang="ts" setup>
import { computed, ref } from 'vue'
import type Order from '#models/order'
import { AdminLayout, SearchField, StatusBadge } from '~/components'
import { Card, Select, Paginator } from '~/components/ui'
import { friendlyDate } from '~/shared/utils'
import { router } from '@inertiajs/vue3'
import { statusOptions } from '~/shared/status_options'
import type { Meta } from '~/types/metadata'

const { data } = defineProps<{ data: { data: Order[]; meta: Meta } }>()

const orders = computed(() => data.data)
const metadata = computed(() => data.meta)

const status = ref('')
const terms = ref('')

const statusFilterOptions = [{ label: 'Todos', value: '' }, ...statusOptions]

function getCustomerFullName(order: Order) {
  try {
    return `${order.customer.firstName} ${order.customer.lastName}`
  } catch (error) {
    return 'Unknown'
  }
}

const showOrder = (order: Order) => {
  router.visit(`/admin/orders/${order.id}`)
}

function filterByStatus(status: Order['status']) {
  router.get(`/admin/orders`, { status }, { replace: true, preserveState: true })
}

function changePage(page: number) {
  router.get(`/admin/orders`, { page }, { replace: true, preserveState: true })
}

function search() {
  router.get(
    `/admin/orders`,
    { terms: terms.value, page: 1 },
    { replace: true, preserveState: true }
  )
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-4 px-2">
          Filtrar por estado
          <Select
            class="w-60"
            :options="statusFilterOptions"
            v-model="status"
            @change="({ value }) => filterByStatus(value as Order['status'])" />
        </div>
      </div>
    </template>

    <SearchField
      v-model:terms="terms"
      class="mb-4"
      placeholder="Ingrese nombre o apellido del cliente"
      @update:terms="search" />

    <div v-if="!orders.length" class="py-4 text-center text-gray-600">
      <div class="text-lg font-bold">No hay pedidos para la búsqueda seleccionada.</div>
    </div>

    <div v-else class="xs:grid-cols-1 grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        v-for="order of orders"
        :key="order.id"
        @click="showOrder(order)"
        class="cursor-pointer transition-all hover:bg-gray-50 hover:shadow-md">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="font-semibold">
              {{ getCustomerFullName(order) }}
            </h1>
            <StatusBadge :status="order.status" />
          </div>
        </template>
        <p>Fecha: {{ friendlyDate(order.createdAt) }}</p>
        <p>Items: {{ order.cartItems.length }}</p>
      </Card>
    </div>
    <Paginator
      v-if="metadata.lastPage > 1"
      class="mt-4"
      :last-page="metadata.lastPage"
      v-model="metadata.currentPage"
      @change="changePage" />
  </AdminLayout>
</template>
