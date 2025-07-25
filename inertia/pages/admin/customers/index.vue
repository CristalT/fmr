<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { AdminLayout } from '~/components'
import { Input, Table, Button } from '~/components/ui'
import http from '~/shared/http'
import type Customer from '#models/customer'
import { Meta } from '~/types/metadata'

const users = ref<Customer[]>([])

const params = useLocalStorage('customersSearchParams', {
  terms: '',
  page: 1,
})

const metadata = ref<Meta>({
  lastPage: 0,
  perPage: 0,
  total: 0,
  firstPage: 0,
  currentPage: 0,
})

async function fetchCustomers() {
  const {data} =  await http('admin/customers')
    .cancellable('getCustomers')
    .query(params)
    .get<{ data: { data: Customer[]; meta: Meta }}>()

  users.value = data.data
  metadata.value = data.meta
}

const search = useDebounceFn(() => {
  fetchCustomers()
}, 1000)

function changePage(page: number) {
  params.value.page = page
  fetchCustomers()
}
onMounted(() => {
  fetchCustomers()
})
</script>
<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex justify-end">
        <Button variant="primary" label="Crear Cliente" @click="router.get('/admin/customers/create')" />
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <div class="p-2 bg-white shadow-sm rounded-md">
        <Input v-model="params.terms" placeholder="Buscar ..." @update:model-value="search" />
      </div>

      <Table :columns="[
        { label: 'Nombre', key: 'fullName' },
        { label: 'Teléfono', key: 'phone' },
        { label: 'Email', key: 'email' },
      ]" :data="users" :metadata @page-change="changePage" @row-click="router.get(`/admin/customers/${$event.id}/edit`)" />
    </div>

  </AdminLayout>
</template>
