<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import Input from '~/components/ui/input/Input.vue'
import Paginator from '~/components/Paginator.vue'
import type { Message } from '~/types/message'
import { Meta } from '~/types/metadata'
import { router } from '@inertiajs/vue3'
import { friendlyDate } from '~/shared/utils'

const props = defineProps<{ messages: { data: Message[]; meta: Meta } }>()

const terms = ref('')

const meta = props.messages.meta

function search(terms: string) {
  router.get('/admin/messages', { terms }, { replace: true })
}

function changePage(page: number) {
  router.get('/admin/messages', { page }, { replace: true })
}

onMounted(() => {
  const url = new URLSearchParams(window.location.search)
  terms.value = url.get('terms') || ''
})
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
          <th class="text-left p-2">Contacto</th>
          <th class="text-left p-2">Fecha</th>
        </tr>
      </thead>
      <tbody v-if="messages.data.length">
        <tr
          v-for="message of messages.data"
          :key="message.id"
          class="border-b hover:bg-gray-50 cursor-pointer"
          :class="{ 'font-bold': !message.read }"
          @click="router.get(`/admin/messages/${message.id}`)"
        >
          <td class="p-2">{{ message.name }}</td>
          <td class="p-2">{{ message.from }}</td>
          <td class="p-2">{{ friendlyDate(message.createdAt) }}</td>
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
