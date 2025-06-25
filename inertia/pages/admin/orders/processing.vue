<script setup lang="ts">
import type Order from '#models/order'
import AdminLayout from '~/components/AdminLayout.vue'
import { Button, Card, Icon, Input, Select } from '~/components/ui'
import type { Column } from '~/components/ui/table/Table.vue'
import { useOrder } from '~/composables'
import { friendlyDate } from '~/shared/utils'
import type CartItem from '#models/cart_item'
import StatusBadge from '~/components/StatusBadge.vue'
import { ref } from 'vue'
import http from '~/shared/http'
import { OrderStatus } from '#types/order_status'
import { statusOptions } from '~/shared/status_options';

const { order } = defineProps<{ order: Order }>()

const { total, setStatus, asked, delivered } = useOrder(order)

const cartItems = ref(order.cartItems)
const isSaving = ref<boolean | undefined>(undefined)

const { customerFullName } = useOrder(order)

const columns: Column[] = [
  { label: 'Código', key: 'code', align: 'center' },
  { label: 'Nombre', key: 'name', align: 'left' },
  { label: 'Cantidad', key: 'quantity', align: 'center' },
  { label: 'Precio', key: 'price', align: 'right' },
  { label: 'Entregado', key: 'delivered', align: 'center' },
  { label: 'Importe', key: 'amount', align: 'right' }
]

function setIsSaving(value: boolean, delay = 0) {
  setTimeout(() => {
    isSaving.value = value
  }, delay)
}

const updateCartItem = (item: CartItem) => {
  setIsSaving(true)

  http(`/admin/cart-items/${item.id}`)
    .query({ orderId: order.id })
    .cancellable('updateCartItem')
    .patch({ delivered: item.delivered })
    .finally(() => setIsSaving(false, 800))
}
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
      <h3 class="text-md font-bold">{{ friendlyDate(order.createdAt) }}</h3>
    </Card>

    <table class="w-full bg-white shadow-sm rounded-md">
      <thead class="border-b">
        <tr>
          <th v-for="(col, key) of columns" :key="key" class="p-2" :class="`text-${col.align || 'left'}`">{{ col.label
            }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, key) of cartItems" :key="key" class="border-b">
          <td class="text-center p-2">{{ row.code }}</td>
          <td class="p-2">{{ row.name }}</td>
          <td class="text-center p-2">{{ row.quantity }}</td>
          <td class="text-right p-2 currency">{{ Math.round(row.product.price) }}</td>
          <td class="flex justify-center p-2">
            <Input type="number" v-model="row.delivered" alignment="center" class="w-24" :debounce="800"
              @update:modelValue="updateCartItem(row)" />
          </td>
          <td class="text-right p-2 currency">{{ Math.round(row.product.price * row.quantity) }}</td>
        </tr>

      </tbody>
    </table>
    <template #footer>
      <div class="flex justify-between items-center">
        <div class="pl-2 text-gray-600">
          <span v-show="isSaving">Guardando ...</span>
          <span v-show="isSaving === false" class="flex gap-2">
            <Icon name="check" class="text-green-500" />
            Guardado
          </span>
        </div>
        <div class="flex justify-end items-center gap-4">
          <div>
            <span>Items pendientes</span> <span class="text-right font-semibold">{{ asked - delivered }}</span>
          </div>
          <div>
            <span>Total</span> <span class="text-right currency font-semibold"> {{ Math.round(total) }}</span>
          </div>
          <Button label="Finalizar" variant="primary" @click="setStatus(OrderStatus.Completed)">
            <template #icon>
              <Icon name="check" />
            </template>
          </Button>
        </div>
      </div>
    </template>
  </AdminLayout>
</template>
