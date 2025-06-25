<script setup lang="ts">
import type Order from '#models/order'
import MainLayout from '~/components/MainLayout.vue'
import { Table,  Card } from '~/components/ui'
import StatusBadge from '~/components/StatusBadge.vue'
import type { Column } from '~/components/ui/table/Table.vue'
import { useOrder } from '~/composables'
import { friendlyDate } from '~/shared/utils'
import MainHeader from '~/components/MainHeader.vue'

const { order } = defineProps<{ order: Order }>()


const { customerFullName } = useOrder(order)

const columns: Column[] = [
  { label: 'Código', key: 'code', align: 'center' },
  { label: 'Nombre', key: 'name', align: 'left' },
  { label: 'Cantidad', key: 'quantity', align: 'center' },
  { label: 'Entregado', key: 'delivered', align: 'center' },
]

</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <Card class="flex flex-col mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Pedido #{{ order.id }}</h1>
          <StatusBadge :status="order.status" />
        </div>
      </template>
      <h2 class="text-lg font-bold">{{ customerFullName }}</h2>
      <h3 class="text-md font-bold">{{ friendlyDate(order.createdAt) }}</h3>
    </Card>

    <Table :columns="columns" :data="order.cartItems" />
  </MainLayout>
</template>
