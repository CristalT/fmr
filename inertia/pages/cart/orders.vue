<script setup lang="ts">
import type Order from '#models/order'
import MainHeader from '~/components/MainHeader.vue'
import MainLayout from '~/components/MainLayout.vue'

import { friendlyDate } from '~/shared/utils'

defineProps<{ orders: Order[] }>()

</script>
<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div class="bg-white rounded-md">
      <table class="bg-white rounded-md shadow-md mx-auto w-full overflow-hidden">
        <thead>
          <tr class="bg-white border-b">
            <th class="py-2 px-4 text-center">#</th>
            <th class="py-2 px-4 text-center">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order of orders" :key="order.id" class="border-b">
            <td class="text-center py-2 px-4">{{ order.id }}</td>
            <td class="text-center py-2 px-4">{{ friendlyDate(order.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>


  </MainLayout>
</template>
