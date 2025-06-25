<script lang="ts" setup>
import { ref } from 'vue'
import Order from '#models/order'
import AdminLayout from '~/components/AdminLayout.vue'
import { Card, Button, Select } from '~/components/ui'
import { friendlyDate } from '~/shared/utils'
import { router } from '@inertiajs/vue3'
import { statusOptions } from '~/shared/status_options'
import StatusBadge from '~/components/StatusBadge.vue'

defineProps<{ orders: Order[] }>()

const status = ref('')

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

</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between gap-2">
        Filtrar por estado:
        <Select class="w-60" :options="statusFilterOptions" v-model="status" @change="({value}) => filterByStatus(value as Order['status'])" />
      </div>
    </template>
    <div v-if="!orders.length" class="text-gray-600 text-center py-4">
      <div class="text-lg font-bold">No hay pedidos para la búsqueda seleccionada.</div>
    </div>
    <div v-else class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      <Card v-for="order of orders" :key="order.id">
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

        <template #footer>
          <div class="flex items-center gap-2">
            <Button label="Ver" size="sm" class="w-full" @click="showOrder(order)" />
          </div>
        </template>
      </Card>
    </div>
  </AdminLayout>

</template>
