<script setup lang="ts">
import { Table } from '~/components/ui'
import type Product from '#models/product'
import { computed, ref } from 'vue'
import { useProduct } from '~/composables'
import { ProductImage } from '.'
import SearchField from './SearchField.vue'

const params = ref({
  terms: '',
  page: 1,
})

const { data } = useProduct().fetchAll(params)
const model = defineModel<string[]>({ required: true })

const products = computed(() => data.value?.data || [])
const metadata = computed(() => data.value?.meta)

const toggleProduct = (product: Product) => {
  const idx = model.value.findIndex((id) => id === product.id)

  if (idx > -1) {
    model.value.splice(idx, 1)
  } else {
    model.value.push(product.id)
  }
}
</script>
<template>
  <SearchField
    v-model:terms="params.terms"
    v-model:page="params.page"
    flat
    class="mb-2"
    placeholder="Buscar productos ..." />
  <Table
    class="text-sm"
    :columns="[
      { label: 'Código', key: 'code' },
      { label: 'Descripción', key: 'name' },
    ]"
    :data="products"
    :selected-rows="model"
    :metadata
    @page-change="(value) => (params.page = value)"
    @row-click="toggleProduct">
    <template #prepend="{ row }">
      <ProductImage :product="row" class="h-10 w-10" />
    </template>
  </Table>
</template>
