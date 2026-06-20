<script setup lang="ts">
import type Provider from '#models/provider'
import { router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { AdminLayout } from '~/components'
import { Card, Input, Button, Icon } from '~/components/ui'
import { useConfirm, useProvider, useToast } from '~/composables'

const { provider, productCounts } = defineProps<{
  provider: Provider
  productCounts: { published: number; unpublished: number }
}>()

const form = useForm({
  alias: provider.alias,
  name: provider.name,
  email: provider.email,
})

const counts = ref({ ...productCounts })

const { confirmation } = useConfirm()
const { toast } = useToast()
const { updateProductsPublication } = useProvider()
const { mutateAsync: mutateProductsPublication } = updateProductsPublication(provider.alias)

async function setProductsPublication(isPublic: boolean) {
  const conf = await confirmation({
    title: isPublic ? 'Publicar artículos' : 'Despublicar artículos',
    message: `¿Confirmás ${isPublic ? 'publicar' : 'despublicar'} todos los artículos de este proveedor?`,
    confirm: isPublic ? 'Publicar' : 'Despublicar',
    type: isPublic ? 'success' : 'warning',
  })
  if (!conf) return

  mutateProductsPublication(isPublic)
    .then(({ total, published, unpublished }) => {
      counts.value = { published, unpublished }
      toast.success(`Se actualizaron ${total} artículos.`)
    })
    .catch(() => toast.error('Error al actualizar los artículos.'))
}
</script>
<template>
  <form @submit.prevent="form.put(`/admin/providers/${provider.alias}`)">
    <AdminLayout>
      <template #topbar>
        <Button label="Volver" variant="tertiary" @click="router.visit('/admin/providers/list')">
          <template #icon>
            <Icon name="chevronLeft" />
          </template>
        </Button>
      </template>
      <div class="flex flex-col gap-2">
        <Card>
          <template #header>
            <h2 class="text-lg font-medium text-gray-900">Editar proveedor</h2>
          </template>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <Input v-model="form.alias" disabled class="basis-1/4" label="ID" :error="form.errors.alias" />
              <Input v-model="form.name" class="basis-3/4" label="Razón Social" :error="form.errors.name" />
            </div>
            <Input v-model="form.email" type="email" label="Email" :error="form.errors.email" />
          </div>
        </Card>
        <Card>
          <template #header>
            <h2 class="text-lg font-medium text-gray-900">Artículos del proveedor</h2>
          </template>
          <div class="flex flex-col gap-3">
            <div class="flex gap-4 text-sm text-gray-600">
              <span>Publicados: <strong>{{ counts.published }}</strong></span>
              <span>No publicados: <strong>{{ counts.unpublished }}</strong></span>
            </div>
            <div class="flex flex-row gap-2">
              <Button
                type="button"
                label="Publicar todos los artículos"
                variant="primary"
                @click="setProductsPublication(true)" />
              <Button
                type="button"
                label="Despublicar todos los artículos"
                variant="tertiary"
                @click="setProductsPublication(false)" />
            </div>
          </div>
        </Card>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <Button type="submit" label="Aceptar" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
