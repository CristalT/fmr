<script lang="ts" setup>
import { computed, ref } from 'vue'
import type Order from '#models/order'
import AdminLayout from '~/components/AdminLayout.vue'
import { Card, Select, Paginator, Input } from '~/components/ui'
import { friendlyDate } from '~/shared/utils'
import { router } from '@inertiajs/vue3'
import { statusOptions } from '~/shared/status_options'
import StatusBadge from '~/components/StatusBadge.vue'
import type { Meta } from '~/types/metadata'

const { data } = defineProps<{ data: { data: Order[]; meta: Meta } }>()

const orders = computed(() => data.data)
const metadata = computed(() => data.meta)

const status = ref('')
const terms = ref('')

const statusFilterOptions = [
  { label: 'Todos', value: '' },
  ...statusOptions
]

function getCustomerFullName(order: Order) {
  try {
    return `${order.customerUser.firstName} ${order.customerUser.lastName}`
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
  router.get(`/admin/orders`, { terms: terms.value, page: 1 }, { replace: true, preserveState: true })
}

</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between gap-2">
        <Input class="w-60" v-model="terms" placeholder="Buscar ..." clearable :debounce="800" @update:model-value="search" />
        <Select class="w-60" :options="statusFilterOptions" v-model="status" @change="({value}) => filterByStatus(value as Order['status'])" />
      </div>
    </template>
    <div v-if="!orders.length" class="text-gray-600 text-center py-4">
      <div class="text-lg font-bold">No hay pedidos para la búsqueda seleccionada.</div>
    </div>
    <div v-else class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      <Card v-for="order of orders" :key="order.id" @click="showOrder(order)" class="cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-bold">
              {{ getCustomerFullName(order) }}
            </h1>
            <StatusBadge :status="order.status" />
          </div>
        </template>
        <p>
          Fecha: {{ friendlyDate(order.createdAt) }}
        </p>
        <p>
          Items: {{ order.cartItems.length }}
        </p>
      </Card>
    </div>
    <Paginator v-if="metadata.lastPage > 1" class="mt-4" :last-page="metadata.lastPage" :current-page="metadata.currentPage" @change="changePage" />
  </AdminLayout>
</template>
