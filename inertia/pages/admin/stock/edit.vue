<script setup lang="ts">
import { Input, Button, Toggle, Icon, Card } from '~/components/ui'
import { AdminLayout, ImageUpload } from '~/components'
import { computed, reactive, ref, watch } from 'vue'
import type Product from '#models/product'
import { useStock, useToast, usePath } from '~/composables'
import { router } from '@inertiajs/vue3'
import SavingIndicator from '~/components/SavingIndicator.vue'
import http from '~/shared/http'

const { toast } = useToast()
const { update } = useStock()

const { imagePath } = usePath()

const { product } = defineProps<{
  product: Product
}>()

const image = ref<File>()

const form = reactive({
  id: product.id,
  code: product.code,
  provider: product.provider,
  factoryCode: product.factoryCode || '',
  name: product.name,
  fob: product.fob,
  price: product.price,
  stock: product.stock,
  location: product.location,
  public: product.public,
  image: product.image,
})

const { mutate, isPending, isSuccess, isError } = update(product.id, form)

watch(
  form,
  () => {
    mutate()
  },
  { deep: true }
)

watch(image, (value) => {
  if (!value) {
    form.image = ''
    return
  }
  http(`/admin/stock/${product.id}/image`)
    .upload({ imageFile: value })
    .catch((error) => {
      console.error('Image upload failed:', error)
      toast.error('Error al subir la imagen.')
    })
})

const isPublic = computed({
  get: () => Boolean(form.public),
  set: (value) => {
    form.public = value ? 1 : 0
  },
})
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <nav class="flex justify-between gap-2 items-center">
        <Button label="Volver" variant="tertiary" @click="router.visit('/admin/stock/view')">
          <template #icon>
            <Icon name="chevronLeft" />
          </template>
        </Button>
        <SavingIndicator
          class="mr-4"
          :is-saving="isPending"
          :is-saved="isSuccess"
          :is-error="isError"
        />
      </nav>
    </template>
    <form>
      <Card>
        <template #header>
          <h2 class="text-lg font-medium text-gray-900">Editar producto</h2>
        </template>
        <div class="flex p-4 gap-4">
          <div class="basis-4/6 flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <Input class="basis-2/6" label="Código" v-model="form.code" disabled />
              <Input class="basis-2/6" label="Proveedor" v-model="form.provider" disabled />
              <Input class="basis-2/6" label="Catálogo" v-model="form.factoryCode" disabled />
            </div>
            <div class="w-full">
              <Input label="Descripción" v-model="form.name" disabled />
            </div>
            <div class="flex gap-2">
              <div class="w-full">
                <Input label="Costo" v-model="form.fob" disabled />
              </div>
              <div class="w-full">
                <Input label="Precio" v-model="form.price" disabled />
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-full">
                <Input label="Stock" v-model="form.stock" type="number" disabled />
              </div>
              <div class="w-full">
                <Input label="Ubicación" v-model="form.location" disabled />
              </div>
            </div>
            <div class="flex gap-4 items-center justify-between mt-4 border-t pt-4">
              <Toggle label="Público" v-model="isPublic" />
            </div>
          </div>
          <div class="basis-2/6 flex justify-center">
            <ImageUpload
              :product
              :src="imagePath(product.image)"
              label="Imagen"
              v-model="image"
              accept="image/png,image/jpg,image/jpeg,image/webp"
            />
          </div>
        </div>
      </Card>
    </form>
  </AdminLayout>
</template>
