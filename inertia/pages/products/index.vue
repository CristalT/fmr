<script lang="ts" setup>
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import ProductCard from '~/components/ProductCard.vue'
import Input from '~/components/ui/input/Input.vue'
import { Paginator } from '~/components/ui'
import type Product from '#models/product'
import type { Meta } from '~/types/metadata'
import { computed, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import http from '~/shared/http'

const data = ref<{ data: Product[]; meta: Meta }>()

const products = computed(() => data.value?.data as Product[] || [])
const meta = computed<Meta>(() => data.value?.meta as Meta || {})

const isFetching = ref(false)


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
    const response = await http('products/list')
      .query(params)
      .cancellable('get_public_products_list')
      .get<{ data: { data: Product[]; meta: Meta } }>()

    data.value = response.data
  } catch (err) {
    console.error(err)
  } finally {
    isFetching.value = false
  }
}

const search = () => {
  params.page = 1
  doFetch()
}
</script>

<template>
  <MainLayout :loading="isFetching">
    <template #header>
      <MainHeader />
    </template>

    <div class="bg-white rounded p-4 shadow-sm mb-4">
      <Input placeholder="Buscar ..." v-model="params.terms" @update:model-value="search" :debounce="800" clearable/>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="product of products" :key="product.id" :product />
    </div>
    <Paginator
      v-model="params.page"
      v-if="products.length"
      class="mt-4 pb-4"
      :last-page="meta.lastPage"
      :current-page="meta.currentPage"
      @update:model-value="doFetch()"
    />
  </MainLayout>
</template>
