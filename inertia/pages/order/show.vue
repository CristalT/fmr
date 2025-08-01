<script setup lang="ts">
import type Order from '#models/order'
import MainLayout from '~/components/MainLayout.vue'
import { Table, Card } from '~/components/ui'
import StatusBadge from '~/components/StatusBadge.vue'
import type { Column } from '~/components/ui/table/Table.vue'
import { useOrder } from '~/composables'
import { friendlyDate } from '~/shared/utils'
import MainHeader from '~/components/MainHeader.vue'
import { computed } from 'vue'
import { sumBy } from 'lodash-es'

const { order } = defineProps<{ order: Order }>()

const { customerFullName } = useOrder(order)

const columns: Column[] = [
  { label: 'Código', key: 'code', align: 'center' },
  { label: 'Nombre', key: 'name', align: 'left' },
  { label: 'Cantidad', key: 'quantity', align: 'center' },
  { label: 'Entregado', key: 'delivered', align: 'center' },
]

const cartItems = computed(() =>
  order.cartItems.map((item) => ({
    ...item,
    code: item.product.code,
    name: item.product.name,
  }))
)

const total = sumBy(order.cartItems, (item) => item.product.price * item.quantity)
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <Card class="mb-4 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-bold">Pedido #{{ order.id }}</h1>
          <StatusBadge :status="order.status" />
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <div>Cliente: {{ customerFullName }}</div>
        <div>Fecha: {{ friendlyDate(order.createdAt) }}</div>
        <div>Total: ${{ total }}</div>
      </div>
    </Card>

    <Table :columns="columns" :data="cartItems" />
  </MainLayout>
</template>
