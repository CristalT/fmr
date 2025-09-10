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
        @row-click="(row) => router.visit(`/admin/providers/${row.alias}/edit`)" />
    </div>
  </AdminLayout>
</template>
