<script setup lang="ts">
import type Order from '#models/order'
import AdminLayout from '~/components/AdminLayout.vue'
import { Table, Button, Card, Icon, Select } from '~/components/ui'
import type { Column } from '~/components/ui/table/Table.vue'
import { useOrder } from '~/composables'
import { friendlyDate } from '~/shared/utils'
import { OrderStatus } from '#types/order_status'
import { statusOptions } from './status_options';

const { order } = defineProps<{ order: Order }>()

const { customerFullName } = useOrder(order)

const columns: Column[] = [
  { label: 'Código', key: 'code', align: 'center' },
  { label: 'Nombre', key: 'name', align: 'left' },
  { label: 'Cantidad', key: 'quantity', align: 'center' },
]

const print = () => {
  window.open(`/admin/orders/${order.id}/print`, '_blank')
}

const patchStatus = (status: Order['status']) => {
  useOrder(order).setStatus(status)
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between gap-2">
        <Select class="w-60" :options="statusOptions" v-model="order.status" @change="({ value })=> patchStatus(value as OrderStatus)" />
        <Button label="Imprimir" variant="tertiary" @click="print">
          <template #icon><Icon name="print" /></template>
        </Button>
      </div>
    </template>
      <Card class="flex flex-col mb-4">
        <template #header>
          <h1 class="text-xl font-bold">Pedido #{{ order.id }}</h1>
        </template>
        <h2 class="text-lg font-bold">{{ customerFullName }}</h2>
        <h3 class="text-md font-bold">{{ friendlyDate(order.createdAt) }}</h3>
      </Card>
      <Table :columns="columns" :data="order.cartItems" />
  </AdminLayout>
</template>
