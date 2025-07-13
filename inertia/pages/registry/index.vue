<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { friendlyDate } from '~/shared/utils'
import { AdminLayout } from '~/components'
import { Input, Table } from '~/components/ui'
import { Column } from '~/components/ui/table/Table.vue';
import type Registry from '#models/registry'

const props = defineProps(['registries'])

const meta = props.registries.meta
const registries = props.registries.data.map((registry: Registry) => ({
  ...registry,
  createdAt: friendlyDate(registry.createdAt),
}))
const columns: Column[] = [
  { label: 'Nombre', key: 'fullName' },
  { label: 'DNI', key: 'dni' },
  { label: 'Fecha', key: 'createdAt' },
]
const terms = ref('')

const search = () => {
  router.get('/admin/registries', { terms: terms.value }, { replace: true })
}

const changePage = (page: number) => {
  router.get('/admin/registries', { page }, { replace: true })
}

function openEdit(registry: Registry) {
  router.get(`/admin/registries/${registry.id}/edit`)
}

const url = new URL(window.location.href)
terms.value = url.searchParams.get('terms') || ''

</script>
<template>
  <AdminLayout>
    <div class="flex flex-col gap-2">
      <div class="p-2 bg-white shadow-sm rounded-md">
        <Input
          v-model="terms"
          placeholder="Buscar ..."
          @update:model-value="search"
          :debounce="800"
          autofocus
          clearable
        />
      </div>
      <Table :columns="columns" :data="registries" @rowClick="openEdit" @pageChange="changePage" :metadata="meta" />
    </div>
  </AdminLayout>
</template>
