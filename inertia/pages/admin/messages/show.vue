<script lang="ts" setup>
import { Message } from '~/types/message'
import { Button, Icon } from '~/components/ui'
import { AdminLayout } from '~/components'
import { router } from '@inertiajs/vue3'
import { useConfirm, useToast } from '~/composables'

const { confirmation } = useConfirm()
const { toast } = useToast()

const props = defineProps<{ message: Message }>()

const handleDelete = async () => {
  const conf = await confirmation({ 
    title: 'Eliminar mensaje', 
    type: 'danger', 
    message: `Está por eliminar el mensaje #${props.message.id}. ¿Desea continuar?`,
    confirm: 'Eliminar'
  })

  if (!conf) return
  router.delete(`/admin/messages/${props.message.id}`, {
    onSuccess: () => {
      router.visit('/admin/messages')
    },
    onError: () => {
      toast.error('Ocurrió un error al eliminar el mensaje, intente nuevamente.')
    }
  })
}
</script>

<template>
  <AdminLayout>
    <div class="w-full mx-auto p-4">
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-800">Mensaje #{{ message.id }}</h1>
            <Button variant="danger" flat @click="handleDelete" label="Eliminar">
              <template #icon>
                <Icon name="delete" />
              </template>
            </Button>
          </div>

          <div class="space-y-4">
            <div>
              <h2 class="text-sm font-semibold text-gray-600">De:</h2>
              <div class="mt-1">
                <p class="text-gray-800">{{ message.name }}</p>
                <p class="text-gray-600 text-sm">{{ message.from }}</p>
              </div>
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-600">Asunto</h2>
              <p class="mt-1 text-gray-800 whitespace-pre-wrap">{{ message.subject }}</p>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-600">Message</h2>
              <p class="mt-1 text-gray-800 whitespace-pre-wrap">{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
