<script setup lang="ts">
import type Order from '#models/order'
import { AdminLayout } from '~/components'
import { Table, Button, Card, Icon, Select } from '~/components/ui'
import StatusBadge from '~/components/StatusBadge.vue'
import type { Column } from '~/components/ui/table/Table.vue'
import { useOrder } from '~/composables'
import { friendlyDate } from '~/shared/utils'
import { OrderStatus } from '#types/order_status'
import { statusOptions } from '~/shared/status_options'
import { computed } from 'vue'

const { order } = defineProps<{ order: Order }>()

const { setStatus, destroy } = useOrder(order)

const { customerFullName } = useOrder(order)

const columns: Column[] = [
  { label: 'Código', key: 'code', align: 'center' },
  { label: 'Nombre', key: 'name', align: 'left' },
  { label: 'Cantidad', key: 'quantity', align: 'center' },
]

const cartItems = computed(() =>
  order.cartItems.map((item) => ({
    ...item,
    code: item.product.code,
    name: item.product.name,
  }))
)
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-4 px-2">
          Cambiar estado
          <Select
            class="w-60"
            :options="statusOptions"
            v-model="order.status"
            @change="({ value }) => setStatus(value as OrderStatus)" />
        </div>

        <Button
          v-if="order.status === OrderStatus.Cancelled"
          label="Eliminar"
          variant="danger"
          flat
          @click="destroy">
          <template #icon><Icon name="delete" /></template>
        </Button>
      </div>
    </template>
    <Card class="mb-4 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Pedido #{{ order.id }}</h1>
          <StatusBadge :status="order.status" />
        </div>
      </template>
      <h2 class="text-lg font-bold">{{ customerFullName }}</h2>
      <h3 class="text-md font-bold">{{ friendlyDate(order.createdAt) }}</h3>
    </Card>
    <Table :columns="columns" :data="cartItems" />
  </AdminLayout>
</template>
