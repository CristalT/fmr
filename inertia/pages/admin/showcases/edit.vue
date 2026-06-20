<script lang="ts" setup>
import { AdminLayout } from '~/components'
import { Input, Card, Button, Icon } from '~/components/ui'
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { useConfirm, useToast } from '~/composables'
import ShowcaseProducts from '~/components/ShowcaseProducts.vue'

import type Showcase from '#models/showcase'
import type Product from '#models/product'

const props = defineProps<{ showcase: Showcase }>()

const { confirmation } = useConfirm()
const { toast } = useToast()

const showcase = useForm<{
  name: string
  description: string | null
  products: string[]
}>({
  name: props.showcase.name,
  description: props.showcase.description,
  products: props.showcase.products.map((product) => product.id),
})

const selected = ref<string[]>(props.showcase.products.map((product) => product.id))
const selectedProducts = ref<Product[]>(props.showcase.products)

const save = () => {
  showcase.products = selected.value
  showcase.put(`/admin/showcases/${props.showcase.id}`, {
    onError: () => {
      toast.error('Ocurrió un error al actualizar la vidriera')
    },
  })
}

const deleteShowcase = async () => {
  const conf = await confirmation({
    title: 'Eliminar vidriera',
    message: `¿Desea eliminar la vidriera ${props.showcase.name}?`,
    type: 'danger',
    confirm: 'Eliminar',
    cancel: 'Cancelar',
  })
  if (!conf) return
  showcase.delete(`/admin/showcases/${props.showcase.id}`)
}
</script>
<template>
  <AdminLayout>
    <Card>
      <div class="flex flex-col gap-2">
        <Input
          v-model="showcase.name"
          label="Nombre"
          placeholder="Ingrese un nombre para su vidriera" />
        <Input
          type="textarea"
          v-model="showcase.description"
          label="Descripción"
          placeholder="Ingrese una descripción para su vidriera" />
      </div>
    </Card>

    <ShowcaseProducts v-model="selected" :selected-products="selectedProducts" />
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Eliminar" @click="deleteShowcase" variant="danger" flat>
          <template #icon>
            <Icon name="delete" />
          </template>
        </Button>
        <Button label="Guardar" @click="save" />
      </div>
    </template>
  </AdminLayout>
</template>
