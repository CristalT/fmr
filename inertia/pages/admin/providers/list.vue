<script setup lang="ts">
import { computed, ref } from 'vue'
import { AdminLayout } from '~/components'
import { Table, Input } from '~/components/ui'
import { useProvider } from '~/composables'
import { router } from '@inertiajs/vue3'

const { fetchAll } = useProvider()

const params = ref({
  terms: '',
  page: 1,
})

const { data } = fetchAll(params)

const providers = computed(() => data.value?.data ?? [])
const metadata = computed(() => data.value?.meta)

const columns = [
  { label: 'ID', key: 'alias' },
  { label: 'Razón Social', key: 'name' },
]

function publicationStatus(row: { productCounts?: { published: number; unpublished: number } }) {
  const { published = 0, unpublished = 0 } = row.productCounts ?? {}

  if (published === 0 && unpublished === 0) {
    return { label: 'Sin artículos', color: 'bg-gray-400 text-white' }
  }
  if (published > 0 && unpublished === 0) {
    return { label: 'Publicado', color: 'bg-green-600 text-white' }
  }
  if (published === 0 && unpublished > 0) {
    return { label: 'No publicado', color: 'bg-red-600 text-white' }
  }
  return { label: 'Parcial', color: 'bg-yellow-500 text-white' }
}
</script>
<template>
  <AdminLayout>
    <div class="flex flex-col gap-2">
      <div class="rounded-md bg-white p-2 shadow-sm">
        <Input
          v-model="params.terms"
          placeholder="Buscar ..."
          :debounce="500"
          autofocus
          clearable />
      </div>
      <Table
        :columns
        :data="providers"
        :metadata
        @page-change="(value) => (params.page = value)"
        @row-click="(row) => router.visit(`/admin/providers/${row.alias}/edit`)">
        <template #append="{ row }">
          <span
            class="rounded p-1 text-xs font-semibold"
            :class="publicationStatus(row).color">
            {{ publicationStatus(row).label }}
          </span>
        </template>
      </Table>
    </div>
  </AdminLayout>
</template>
