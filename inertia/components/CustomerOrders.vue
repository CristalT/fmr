<script setup lang="ts">
import { sumBy } from 'lodash-es'
import { ref, computed, watchEffect } from 'vue'
import { Table } from '~/components/ui'
import { useCustomer } from '~/composables'
import { friendlyDate } from '~/shared/utils'

const customerId = defineModel<string | number>({ required: true })

const emit = defineEmits<{
  (event: 'selected', order: { id: number; date: string; amount: number }): void
}>()

const query = ref({ page: 1, limit: 10 })
const { data, refetch } = useCustomer().fetchOrders(customerId, query, { enabled: false })

const orders = computed(
  () =>
    data.value?.data.map((order) => ({
      id: order.id,
      date: friendlyDate(order.createdAt),
      amount: sumBy(order.cartItems, (item) => item.product.price * item.delivered),
    })) ?? []
)
const metadata = computed(() => data.value?.meta)

const columns = [
  { key: 'id', label: '#' },
  { key: 'date', label: 'Fecha' },
  { key: 'amount', label: 'Monto' },
]

const selectedRows = ref<string[]>([])

const handleRowClick = (row: any) => {
  const idx = selectedRows.value.indexOf(row.id)
  if (idx > -1) {
    selectedRows.value.splice(idx, 1)
  } else {
    selectedRows.value.push(row.id)
  }

  emit('selected', row)
}
watchEffect(() => {
  if (customerId.value) {
    refetch()
  }
})
</script>
<template>
  <Table
    :data="orders"
    :columns="columns"
    :metadata="metadata"
    :selected-rows="selectedRows"
    @row-click="(row) => handleRowClick(row)"
    @page-change="(value) => (query.page = value)" />
</template>
