<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AdminLayout } from '~/components'
import { Input, Table } from '~/components/ui'
import type { Message } from '~/types/message'
import { Meta } from '~/types/metadata'
import { router } from '@inertiajs/vue3'
import { friendlyDate } from '~/shared/utils'
import { Column } from '~/components/ui/table/Table.vue'

const props = defineProps<{ messages: { data: Message[]; meta: Meta } }>()

const messages = props.messages.data.map(message => ({
  ...message,
  createdAt: friendlyDate(message.createdAt),
}))

const meta = props.messages.meta

const columns: Column[] = [
  { label: 'Nombre', key: 'name' },
  { label: 'Contacto', key: 'from' },
  { label: 'Fecha', key: 'createdAt' },
]

const terms = ref('')


function search(terms: string) {
  router.get('/admin/messages', { terms }, { replace: true })
}

function changePage(page: number) {
  router.get('/admin/messages', { page }, { replace: true })
}

function showMessage(message: Message) {
  router.visit(`/admin/messages/${message.id}`)
}

onMounted(() => {
  const url = new URLSearchParams(window.location.search)
  terms.value = url.get('terms') || ''
})
</script>
<template>
  <AdminLayout>
    <div class="flex flex-col gap-2">
      <div class="p-2 bg-white shadow-sm rounded-md">
        <Input v-model="terms" placeholder="Buscar ..." @update:model-value="(value) => search(value as string)" :debounce="800" autofocus />
      </div>
      <Table :columns :data="messages" :metadata="meta" @pageChange="changePage" @rowClick="showMessage" />
    </div>
  </AdminLayout>
</template>
