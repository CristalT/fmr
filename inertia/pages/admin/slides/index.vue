<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { Button, Icon, Table } from '~/components/ui'
import { AdminLayout } from '~/components'
import { useSlide } from '~/composables'
import { computed, ref } from 'vue'
import type Slide from '#models/slide'

const { fetchAll, updateOrder } = useSlide()

const { data } = fetchAll()

const renderKey = ref(0)

const items = computed(() => {
  const parse = (slide: Slide) => ({
    id: slide.id,
    title: slide.title,
    order: slide.order,
    public: slide.public ? 'Sí' : 'No',
  })

  return data.value?.map(parse) ?? []
})

const saveNewOrder = (newOrder: any[]) => {
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
  router.visit(`/admin/slides/${id}/edit`)
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex justify-end gap-2">
        <Button label="Crear" @click="router.visit('/admin/slides/create')" />
      </div>
    </template>

    <Table
      v-if="items.length"
      :key="renderKey"
      sortable
      :columns="[
        { label: 'Título', key: 'title' },
        { label: 'Público', key: 'public' },
      ]"
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
