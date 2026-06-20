<script lang="ts" setup>
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import ProductCard from '~/components/ProductCard.vue'
import Input from '~/components/ui/input/Input.vue'
import { Paginator } from '~/components/ui'
import type Product from '#models/product'
import type { Meta } from '~/types/metadata'
import { computed,  ref } from 'vue'
import { useProduct } from '~/composables'

const { fetchAll } = useProduct()

const params = ref<{
  terms: string
  page: number
}>({
  terms: '',
  page: 1,
})

const { data, isFetching } = fetchAll(params)

const products = computed(() => data.value?.data as Product[] || [])
const meta = computed<Meta>(() => data.value?.meta as Meta || {})

</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>

    <div class="relative bg-white rounded p-4 shadow-sm mb-4">
      <Input placeholder="Buscar ..." v-model="params.terms" :debounce="800" clearable @update:model-value="params.page = 1"/>
      <div
        v-if="isFetching"
        class="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
    </div>

    <div v-if="products.length" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="product of products" :key="product.id" :product />
    </div>
    <div v-else-if="!isFetching" class="py-12 text-center text-gray-500">
      No se encontraron productos.
    </div>
    <Paginator
      v-if="products.length"
      v-model="params.page"
      class="mt-4 pb-4"
      :last-page="meta.lastPage"
    />
  </MainLayout>
</template>
