<script setup lang="ts">
import { computed, ref } from 'vue'

import { Card, Input, Button } from '~/components/ui'
import { AdminLayout, Category, SearchField } from '~/components'
import { useCategory, useConfirm, useToast } from '~/composables'

import type CategoryModel from '#models/category'
import ProductSelector from '~/components/ProductSelector.vue'

const { confirmation } = useConfirm()
const { toast } = useToast()
const { fetch, fetchOne, remove, update, create } = useCategory(null)

const { data, refetch } = fetch()

const categories = computed(() => {
  return data.value?.filter((category) =>
    category.name.toLowerCase().includes(terms.value.toLowerCase())
  )
})

const selectedCategory = ref<CategoryModel & { productsCount?: number }>()
const renderKey = ref(1)
const terms = ref('')
const selectedProducts = ref<string[]>([])

async function editCategory(category: CategoryModel) {
  selectedCategory.value = await fetchOne(category.id)
  selectedProducts.value = selectedProducts.value.concat(
    selectedCategory.value.products?.map((p) => p.id) || []
  )
}

async function saveCategory() {
  if (!selectedCategory.value) return

  const payload = {
    ...selectedCategory.value,
    productIds: selectedProducts.value,
  }

  if (selectedCategory.value.id) {
    await update(payload.id, payload)
  } else {
    await create().mutateAsync(payload)
  }

  refetch().then(() => {
    selectedCategory.value = undefined
    renderKey.value++ // Force re-render
  })
}

async function removeCategory() {
  const conf = await confirmation({
    title: 'Eliminar Categoría',
    message:
      '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.',
    confirm: 'Eliminar',
    type: 'danger',
  })

  if (conf) {
    remove(selectedCategory.value!.id)
      .then(() => {
        selectedCategory.value = undefined
        refetch()
      })
      .catch((err) => {
        console.error(err)
        toast.error('Error al eliminar la categoría.')
      })
  }
}
</script>
<template>
  <AdminLayout>
    <SearchField
      :debounce="0"
      class="mb-2"
      placeholder="Buscar categorías..."
      v-model:terms="terms" />
    <div class="flex flex-row gap-2">
      <Card title="Categorías de Productos" class="flex-1" :key="renderKey">
        <div class="max-h-[calc(100vh-200px)] overflow-y-auto pb-6 scrollbar-thin">
          <Category
            v-for="category in categories"
            :key="category.id"
            :category="category"
            class="my-1 rounded border"
            @edit="editCategory" />
        </div>
      </Card>
      <div class="flex flex-1 flex-col gap-2">
        <form v-if="selectedCategory">
          <Card title="Editar Categoría">
            <Input type="text" label="Nombre" class="mb-2" v-model="selectedCategory.name" />
            <Input type="text" label="Slug" class="mb-2" v-model="selectedCategory.slug" disabled />
            <Input
              type="textarea"
              label="Descripción"
              class="mb-2"
              v-model="selectedCategory.description" />

            <h2 class="mb-2 mt-4 text-lg font-bold">
              Productos en la Categoría
              <span class="ml-2 rounded-full bg-secondary px-2 py-1 text-sm font-normal text-white">
                {{ selectedProducts.length }}
              </span>
            </h2>

            <ProductSelector v-model="selectedProducts" />

            <div class="mt-4 flex items-center justify-end gap-2">
              <Button
                label="Eliminar"
                variant="danger"
                @click="removeCategory"
                flat
                v-if="!selectedCategory.productsCount" />
              <Button label="Cancelar" variant="tertiary" @click="selectedCategory = undefined" />
              <Button label="Guardar Cambios" @click="saveCategory" />
            </div>
          </Card>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>
