<script setup lang="ts">
import { statusOptions } from '~/shared/status_options'

defineProps<{ status: Order['status'] }>()

import Order from '#models/order'

function getStatusName(status: Order['status']) {
  return statusOptions.find(option => option.value === status)?.label.toUpperCase()
}

const statusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-600 text-white'
    case 'completed':
      return 'bg-green-600 text-white'
    case 'cancelled':
      return 'bg-red-600 text-white'
    case 'processing':
      return 'bg-blue-600 text-white'
    case 'delivered':
      return 'bg-slate-600 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
}
</script>
<template>
  <span v-if="status" class="font-semibold px-2 py-1 rounded text-xs" :class="statusColor(status)">{{
    getStatusName(status) }}</span>

</template>
