<script setup lang="ts">
import { Input, Button, Toggle, Icon, Card } from '~/components/ui'
import { AdminLayout, ImageUpload, CategoriesTree } from '~/components'
import { computed, reactive, ref, watch } from 'vue'
import type Product from '#models/product'
import { useStock, useToast, usePath } from '~/composables'
import { router } from '@inertiajs/vue3'
import SavingIndicator from '~/components/SavingIndicator.vue'
import http from '~/shared/http'
import type Category from '#models/category'

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
  description: product.description || '',
  fob: product.fob,
  price: product.price,
  stock: product.stock,
  location: product.location,
  public: product.public,
  image: product.image,
  categories: product.categories,
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
      <nav class="flex items-center justify-between gap-2">
        <Button label="Volver" variant="tertiary" @click="router.visit('/admin/stock/view')">
          <template #icon>
            <Icon name="chevronLeft" />
          </template>
        </Button>
        <SavingIndicator
          class="mr-4"
          :is-saving="isPending"
          :is-saved="isSuccess"
          :is-error="isError" />
      </nav>
    </template>
    <form>
      <Card>
        <template #header>
          <h2 class="text-lg font-medium text-gray-900">Editar producto</h2>
        </template>
        <div class="flex gap-4 p-4">
          <div class="flex basis-4/6 flex-col gap-2">
            <div class="flex flex-row gap-2">
              <Input class="basis-2/6" label="Código" v-model="form.code" disabled />
              <Input class="basis-2/6" label="Proveedor" v-model="form.provider" disabled />
              <Input class="basis-2/6" label="Catálogo" v-model="form.factoryCode" />
            </div>
            <div class="w-full">
              <Input label="Descripción" v-model="form.name" />
            </div>
            <div class="flex gap-2">
              <div class="w-full">
                <Input label="Costo" v-model="form.fob" />
              </div>
              <div class="w-full">
                <Input label="Precio" v-model="form.price" />
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-full">
                <Input label="Stock" v-model="form.stock" type="number" />
              </div>
              <div class="w-full">
                <Input label="Ubicación" v-model="form.location" />
              </div>
            </div>

            <div class="mt-4 rounded-md border">
              <h2 class="text-md border-b p-2 font-semibold">Categorías</h2>
              <CategoriesTree
                label="Categoría"
                class="m-2"
                v-model="form.categories as unknown as Category[]" />
            </div>
            <div>
              <Input type="textarea" label="Descripción" v-model="form.description" />
            </div>
            <div class="mt-4 flex items-center justify-between gap-4 border-t pt-4">
              <Toggle label="Público" v-model="isPublic" />
            </div>
          </div>
          <div class="flex basis-2/6 justify-center">
            <ImageUpload
              :product
              :src="imagePath(product.image)"
              label="Imagen"
              v-model="image"
              accept="image/png,image/jpg,image/jpeg,image/webp" />
          </div>
        </div>
      </Card>
    </form>
  </AdminLayout>
</template>
