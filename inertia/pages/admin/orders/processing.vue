<script setup lang="ts">
// Models
import type Order from '#models/order'
import { OrderStatus } from '#types/order_status'
import type { Column } from '~/components/ui/table/Table.vue'
import type CartItem from '#models/cart_item'

// Components
import { Button, Card, Icon, Input, Select } from '~/components/ui'
import AdminLayout from '~/components/AdminLayout.vue'
import StatusBadge from '~/components/StatusBadge.vue'
import SavingIndicator from '~/components/SavingIndicator.vue'

// Utilities
import { ref } from 'vue'
import { friendlyDate } from '~/shared/utils'
import http from '~/shared/http'
import { statusOptions } from '~/shared/status_options';

// Composables
import { useOrder } from '~/composables'

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

const print = () => {
  window.open(`/admin/orders/${order.id}/print`, '_blank')
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex items-center justify-between gap-2">
        <Select class="w-60" :options="statusOptions" v-model="order.status"
          @change="({ value }) => setStatus(value as OrderStatus)" />

        <Button label = "Imprimir" variant = "tertiary" @click="print" >
          <template #icon >
            <Icon name="print" />
          </template>
        </Button>
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
              @update:modelValue="updateCartItem(row as CartItem)" />
          </td>
          <td class="text-right p-2 currency">{{ Math.round(row.product.price * row.delivered) }}</td>
        </tr>

      </tbody>
    </table>
    <template #footer>
      <div class="flex justify-between items-center">
        <SavingIndicator :is-saving="isSaving" :is-saved="isSaving === false" />
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
    </template>
  </AdminLayout>
</template>
