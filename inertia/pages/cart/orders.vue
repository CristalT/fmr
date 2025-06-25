<script setup lang="ts">
import type Order from '#models/order'
import MainHeader from '~/components/MainHeader.vue'
import MainLayout from '~/components/MainLayout.vue'
import { friendlyDate } from '~/shared/utils'
import { statusOptions } from '~/shared/status_options'
import { router } from '@inertiajs/vue3'

import { Table } from '~/components/ui'

const { orders } = defineProps<{ orders: Order[] }>()

const data = orders.map(order => ({
  id: order.id,
  createdAt: friendlyDate(order.createdAt),
  status: statusOptions.find(option => option.value === order.status)?.label,
}))
</script>
<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div class="bg-white rounded-md">
      <Table :columns="[
        { label: '#', key: 'id' },
        { label: 'Fecha', key: 'createdAt' },
        { label: 'Estado', key: 'status' },
      ]" :data @row-click="(row) => router.visit(`/orders/${row.id}`)" />
    </div>
  </MainLayout>
</template>
