<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import { Button } from '~/components/ui'
import Input from '~/components/ui/input/Input.vue'
import Paginator from '~/components/Paginator.vue'
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
      <Button
        variant="primary"
        label="Crear Usuario"
        @click="router.get('/admin/customers/create')"
      />
    </template>

    <div class="p-2 bg-white shadow-sm rounded-md">
      <Input v-model="params.terms" placeholder="Buscar ..." @update:model-value="search" />
    </div>
    <table class="w-full bg-white shadow-md rounded-md">
      <thead class="border-b">
        <tr>
          <th class="text-left p-2">Nombre</th>
          <th class="text-left p-2">Teléfono</th>
          <th class="text-left p-2">Email</th>
        </tr>
      </thead>
      <tbody v-if="users.length">
        <tr v-for="user of users" :key="user.id" class="border-b hover:bg-gray-50">
          <td class="p-2">{{ user.firstName }} {{  user.lastName }}</td>
          <td class="p-2">{{ user.phone }}</td>
          <td class="p-2">{{ user.email }}</td>
        </tr>
      </tbody>
      <tbody class="font-mono" v-else>
        <tr>
          <td class="p-2 text-gray-500" colspan="5">No se encontraron resultados.</td>
        </tr>
      </tbody>
      <tfoot v-if="metadata.lastPage > 1">
        <tr>
          <td colspan="5" class="p-2">
            <Paginator
              v-model="metadata.currentPage"
              :last-page="metadata.lastPage"
              @update:model-value="changePage"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </AdminLayout>
</template>
