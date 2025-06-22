<script lang="ts" setup>
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import ProductCard from '~/components/ProductCard.vue'
import Input from '~/components/ui/input/Input.vue'
import useHttp from '~/composables/use_http'
import Paginator from '~/components/Paginator.vue'
import type Product from '#models/product'
import type { Meta } from '~/types/metadata'
import { reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const http = useHttp()
const request = http.path('products/list').cancellable('get_public_products_list')

const products = ref<Product[]>([])
const isFetching = ref(false)
const metadata = ref<Meta>({
  lastPage: 0,
  perPage: 0,
  total: 0,
  firstPage: 0,
  currentPage: 0,
})

const params = reactive<{
  terms: string
  page: number
}>({
  terms: '',
  page: 1,
})

async function doFetch() {
  isFetching.value = true
  try {
    request.query(params)
    const { data, meta } = await request.get<{ data: Product[]; meta: Meta }>()
    products.value = data
    metadata.value = meta
  } catch (err) {
    console.error(err)
  } finally {
    isFetching.value = false
  }
}

const search = useDebounceFn(() => {
  params.page = 1
  doFetch()
}, 1000)
</script>

<template>
  <MainLayout :loading="isFetching">
    <template #header>
      <MainHeader />
    </template>

    <div class="bg-white rounded p-4 shadow-sm mb-4">
      <Input placeholder="Buscar ..." v-model="params.terms" @update:model-value="search" />
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="product of products" :key="product.id" :product />
    </div>
    <Paginator
      v-model="params.page"
      v-if="products.length"
      class="mt-4 pb-4"
      :last-page="metadata.lastPage"
      :current-page="metadata.currentPage"
      @update:model-value="doFetch()"
    />
  </MainLayout>
</template>
