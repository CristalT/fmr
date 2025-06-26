<script setup lang="ts">
import type Order from '#models/order'
import MainHeader from '~/components/MainHeader.vue'
import MainLayout from '~/components/MainLayout.vue'
import { friendlyDate } from '~/shared/utils'
import { statusOptions } from '~/shared/status_options'
import { router } from '@inertiajs/vue3'
import type { Meta } from '~/types/metadata'
import { Table } from '~/components/ui'

const { data } = defineProps<{ data: { data: Order[], meta: Meta } }>()

const orders = data.data.map(order => ({
  id: order.id,
  createdAt: friendlyDate(order.createdAt),
  status: statusOptions.find(option => option.value === order.status)?.label,
}))

const meta = data.meta

const changePage = (page: number) => {
  router.get('orders', { page }, { replace: true })
}
</script>
<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div class="bg-white rounded-md">
      <Table
        :columns="[
          { label: '#', key: 'id' },
          { label: 'Fecha', key: 'createdAt' },
          { label: 'Estado', key: 'status' },
        ]"
        :data="orders"
        :metadata="meta"
        @row-click="(row) => router.visit(`/orders/${row.id}`)"
        @page-change="changePage"
      />
    </div>
  </MainLayout>
</template>
