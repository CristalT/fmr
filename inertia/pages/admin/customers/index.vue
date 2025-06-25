<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import { Input, Table, Button } from '~/components/ui'
import useHttp from '~/composables/use_http'
import type { Customer } from '~/types/customer'
import { Meta } from '~/types/metadata'

const http = useHttp()

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
  const request = http
    .path('admin/customers')
    .cancellable('getCustomers')
    .query(params)
    .get<{ data: Customer[]; meta: Meta }>()

  const { data, meta } = await request

  users.value = data
  metadata.value = meta
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
      <Button variant="primary" label="Crear Usuario" @click="router.get('/admin/customers/create')" />
    </template>

    <div class="flex flex-col gap-2">
      <div class="p-2 bg-white shadow-sm rounded-md">
        <Input v-model="params.terms" placeholder="Buscar ..." @update:model-value="search" />
      </div>

      <Table :columns="[
        { label: 'Nombre', key: 'fullName' },
        { label: 'Teléfono', key: 'phone' },
        { label: 'Email', key: 'email' },
      ]" :data="users" :metadata @page-change="changePage" />
    </div>

  </AdminLayout>
</template>
