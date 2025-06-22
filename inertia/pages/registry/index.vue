<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { friendlyDate } from '~/shared/utils'
import AdminLayout from '~/components/AdminLayout.vue'
import Input from '~/components/ui/input/Input.vue'
import Paginator from '~/components/Paginator.vue'

const props = defineProps(['registries'])

const meta = props.registries.meta
const terms = ref('')
const search = () => {}
const changePage = (page: number) => {}
</script>
<template>
  <AdminLayout>
    <div class="p-2 bg-white shadow-sm rounded-md">
      <Input
        v-model="terms"
        placeholder="Buscar ..."
        @update:model-value="search"
        :debounce="800"
        autofocus
      />
    </div>
    <table class="w-full bg-white shadow-md rounded-md">
      <thead class="border-b">
        <tr>
          <th class="text-left p-2">Nombre</th>
          <th class="text-left p-2">DNI</th>
          <th class="text-left p-2">Fecha</th>
        </tr>
      </thead>
      <tbody v-if="registries.data.length">
        <tr
          v-for="registry of registries.data"
          :key="registry.id"
          class="border-b hover:bg-gray-50 cursor-pointer"
          @click="router.get(`/admin/registries/${registry.id}/edit`)"
        >
          <td class="p-2">{{ registry.firstName }} {{ registry.lastName }}</td>
          <td class="p-2">{{ registry.dni }}</td>
          <td class="p-2">{{ friendlyDate(registry.createdAt) }}</td>
        </tr>
      </tbody>
      <tbody class="font-mono" v-else>
        <tr>
          <td class="p-2 text-gray-500" colspan="5">No se encontraron resultados.</td>
        </tr>
      </tbody>
      <tfoot v-if="meta.lastPage > 1">
        <tr>
          <td colspan="5" class="p-2">
            <Paginator
              :current-page="meta.currentPage"
              :last-page="meta.lastPage"
              v-model="meta.currentPage"
              @update:model-value="changePage"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </AdminLayout>
</template>
