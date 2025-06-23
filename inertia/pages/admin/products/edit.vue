<script setup lang="ts">
import { Input, Button, Toggle } from '~/components/ui'
import AdminLayout from '~/components/AdminLayout.vue'
import ImageUpload from '~/components/ImageUpload.vue'
import usePath from '~/composables/use_path'
import { computed, ref } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import type Product from '#models/product'

const { imagePath } = usePath('')

const { product } = defineProps<{
  product: Product
}>()

const image = ref<File>()

const form = useForm<Partial<Product>>({
  id: product.id,
  code: product.code,
  provider: product.provider,
  name: product.name,
  fob: product.fob,
  price: product.price,
  stock: product.stock,
  location: product.location,
  public: product.public,
})


function submit() {
  const formData = new FormData()

  Object.entries(form.data()).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  if (image.value) {
    formData.append('imageFile', image.value)
  }

  router.put(`/admin/products/${product.id}`, formData, {
    forceFormData: true,
  })
}

const isPublic = computed({
  get: () => Boolean(form.public),
  set: (value) => {
    form.public = value ? 1 : 0
  },
})
</script>

<template>
  <AdminLayout>
    <form>
      <div class="flex p-4 gap-4 bg-white shadow-md rounded-md">
        <div class="basis-4/6">
          <div class="flex flex-row gap-2">
            <Input class="basis-1/6" label="Código" v-model="form.code" disabled />
            <Input class="basis-1/6" label="Proveedor" v-model="form.provider" disabled />
            <Input class="basis-4/6" label="Descripción" v-model="form.name" disabled />
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
          <div class="flex gap-2 items-center mt-4 border-t py-4">
            <Toggle label="Público" v-model="isPublic" />
          </div>
        </div>
        <div class="basis-2/6">
          <ImageUpload :product :src="imagePath(product.image)" label="Imagen" v-model="image" accept="image/png,image/jpg,image/jpeg,image/webp" />
        </div>
      </div>
    </form>
    <template #footer>
      <nav class="flex justify-end gap-2">
        <Button label="Cancelar" variant="tertiary" @click="router.visit('/admin/products')" />
        <Button type="button" label="Guardar" @click="submit" />
      </nav>
    </template>
  </AdminLayout>
</template>
