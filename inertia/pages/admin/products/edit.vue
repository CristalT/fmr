<script lang="ts" setup>
import Input from '~/components/ui/input/Input.vue'
import { Button } from '~/components/ui'
import AdminLayout from '~/components/AdminLayout.vue'
import ImageUpload from '~/components/ImageUpload.vue'
import usePath from '~/composables/use_path'
import { ref } from 'vue'
import Checkbox from '~/components/Checkbox.vue'
import { router } from '@inertiajs/vue3'
import type Product from '#models/product'

const { imagePath } = usePath('')

const props = defineProps<{
  product: Product
}>()

const image = ref<File>()

async function submit() {
  const formData = new FormData()

  if (image.value) {
    formData.append('image', image.value)
  }

  Object.keys(props.product).forEach((key) => {
    const value = props.product[key as keyof Product]
    if (value !== undefined) formData.append(key, String(value))
  })

  await fetch(`${window.location.origin}/admin/products/${props.product.id}`, {
    body: formData,
    method: 'PUT',
  })

  // Avoid using router.get for cache busting
  window.location.replace('/admin/products/view')
}
</script>
<template>
  <AdminLayout>
    <div class="m-4 flex flex-col gap-2 p-4 bg-white shadow-md rounded-md">
      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
          <Input class="basis-1/6" label="Código" v-model="product.code" disabled />
          <Input class="basis-1/6" label="Proveedor" v-model="product.provider" disabled />
          <Input class="basis-4/6" label="Descripción" v-model="product.name" disabled />
        </div>

        <div class="flex gap-2">
          <div class="w-full">
            <Input label="Costo" v-model="product.fob" disabled />
          </div>
          <div class="w-full">
            <Input label="Precio" v-model="product.price" disabled />
          </div>
          <div class="w-full">
            <Input label="Stock" v-model="product.stock" type="number" disabled />
          </div>
          <div class="w-full">
            <Input label="Ubicación" v-model="product.location" disabled />
          </div>
        </div>
        <div class="w-full">
          <Checkbox label="Público" v-model="product.public" valueType="num" />
        </div>

        <div class="mt-4">
          <ImageUpload
            :product
            :src="imagePath(product.image)"
            label="Imagen"
            v-model="image"
            accept="image/png"
          />
        </div>

      </div>
    </div>
    <template #footer>
      <nav class="flex justify-end gap-2">
        <Button label="Cancelar" variant="tertiary" @click="router.visit('/admin/products/view')" />
        <Button @click="submit" label="Guardar" />
      </nav>

    </template>
  </AdminLayout>
</template>
