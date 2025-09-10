<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { Button, Icon, Table } from '~/components/ui'
import { AdminLayout } from '~/components'
import { useShowcase } from '~/composables'
import { computed, ref } from 'vue'
import type Showcase from '#models/showcase'

const { fetchAll, updateOrder } = useShowcase()

const { data } = fetchAll()

const renderKey = ref(0)

const items = computed(() => {
  const parse = (showcase: Showcase) => ({
    id: showcase.id,
    name: showcase.name,
    order: showcase.order,
  })

  return data.value?.map(parse) ?? []
})

const saveNewOrder = (newOrder: any[]) => {
  // Implement your logic to save the new order
  const payload = newOrder.map((item, index) => ({
    id: item.id,
    order: index + 1,
  }))

  updateOrder.mutate(payload, {
    onSettled() {
      renderKey.value++
    },
  })
}

const openForEdit = (id: number) => {
  router.visit(`/admin/showcases/${id}/edit`)
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex justify-end gap-2">
        <Button label="Crear" @click="router.visit('/admin/showcases/create')" />
      </div>
    </template>

    <Table
      v-if="items.length"
      :key="renderKey"
      sortable
      :columns="[{ label: 'Nombre', key: 'name' }]"
      :data="items"
      @rows-reorder="saveNewOrder">
      <template #append="{ row }">
        <Icon
          name="edit"
          size="sm"
          class="cursor-pointer text-gray-600 hover:text-primary"
          @click="openForEdit(row.id)" />
      </template>
    </Table>
  </AdminLayout>
</template>
