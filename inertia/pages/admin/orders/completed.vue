<script setup lang="ts">
import type Order from '#models/order'
import { AdminLayout } from '~/components'
import { Table, Card, Select } from '~/components/ui'
import StatusBadge from '~/components/StatusBadge.vue'
import type { Column } from '~/components/ui/table/Table.vue'
import { useOrder } from '~/composables'
import { friendlyDate } from '~/shared/utils'
import { OrderStatus } from '#types/order_status'
import { statusOptions } from '../../../shared/status_options';


const { order } = defineProps<{ order: Order }>()

const { setStatus } = useOrder(order)

const { total, delivered, pending } = useOrder(order)

const { customerFullName } = useOrder(order)

const columns: Column[] = [
  { label: 'Código', key: 'code', align: 'center' },
  { label: 'Nombre', key: 'name', align: 'left' },
  { label: 'Cantidad', key: 'quantity', align: 'center' },
  { label: 'Entregado', key: 'delivered', align: 'center' },
]

</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between gap-2">
        <Select class="w-60" :options="statusOptions" v-model="order.status"
          @change="({ value }) => setStatus(value as OrderStatus)" />
      </div>
    </template>
    <Card class="flex flex-col mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Pedido #{{ order.id }}</h1>
          <StatusBadge :status="order.status" />
        </div>
      </template>
      <h2 class="text-lg font-bold">{{ customerFullName }}</h2>
      <p>
        Fecha pedido: <span class="text-md font-bold">{{ friendlyDate(order.createdAt) }}</span>
      </p>
      <p>
        Ultima actualización: <span class="text-md font-bold">{{ friendlyDate(order.updatedAt) }}</span>
      </p>
      <p>
        Total: <span class="text-md font-bold">${{ total }}</span>
      </p>
      <p>
        Items entregados: <span class="text-md font-bold">{{ delivered }}</span>
      </p>
      <p>
        Items pendientes: <span class="text-md font-bold">{{ pending }}</span>
      </p>
    </Card>
    <Table :columns="columns" :data="order.cartItems" />
  </AdminLayout>
</template>
