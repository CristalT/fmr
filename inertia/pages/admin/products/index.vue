<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import ProductImage from '~/components/ProductImage.vue'
import ProviderSelect from '~/components/ProviderSelect.vue'

import { computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { router } from '@inertiajs/vue3'
import { Input, Paginator } from '~/components/ui'
import { useProduct } from '~/composables'

const { fetchAll } = useProduct()

const params = useLocalStorage('adminProductsSearchParams', {
  terms: '',
  page: 1,
  filter: {
    provider: '',
  },
})

// Reset page number when search or filter changes
watch(
  () => [params.value.terms, params.value.filter.provider],
  () => params.value.page = 1
)

const { data, isFetched } = fetchAll(params)

const products = computed(() => data.value?.data)
const paginate = computed(() => data.value?.meta)

function openEdit(productId: string) {
  router.get(`/admin/products/${productId}`)
}

function changePage(page: number) {
  params.value.page = page
}


</script>

<template>
  <AdminLayout>
    <div class="flex flex-col gap-2">
      <div class="p-2 bg-white shadow-sm rounded-md flex gap-2">
        <div class="basis-9/12">
          <Input v-model="params.terms" placeholder="Buscar ..." :debounce="500" autofocus clearable />
        </div>
        <div class="basis-3/12">
          <ProviderSelect v-model="params.filter.provider" placeholder="Proveedor" />
        </div>
      </div>
      <div class="rounded-md overflow-hidden shadow-sm">
        <table class="bg-white w-full text-sm">
          <thead class="table w-full table-fixed border-b-2 ">
            <tr>
              <th class="w-[100px]">Foto</th>
              <th class="w-[120px] py-2 px-4 text-left">Código</th>
              <th class="w-[65px] py-2 px-4 text-left">Prov.</th>
              <th class="w-[600px] py-2 px-4 text-left">Descripción</th>
              <th class="w-[120px] py-2 px-4 text-center">Ubicación</th>
              <th class="w-[80px] py-2 px-4 text-center">Stock</th>
              <th class="w-[80px] py-2 px-4 text-right">Precio</th>
            </tr>
          </thead>
          <tbody class="overflow-auto block h-[calc(100vh-200px)]" v-if="products?.length">
            <tr v-for="product of products" :key="product.id"
              class="table-fixed table w-full border-b hover:bg-gray-100 cursor-pointer"
              :class="{ 'opacity-30': !product.public }" @click="openEdit(product.id)">
              <td class="p-2 w-[100px] h-20 text-center">
                <ProductImage rounded :product class="w-20 mx-auto" />
              </td>
              <td class="p-2 w-[120px]">{{ product.code }}</td>
              <td class="p-2 w-[65px]">{{ product.provider }}</td>
              <td class="p-2 w-[600px]">{{ product.name }}</td>
              <td class="p-2 w-[120px] text-center text-xs">{{ product.location }}</td>
              <td class="p-2 w-[80px] text-center">{{ product.stock }}</td>
              <td class="pr-4 w-[80px] text-right">$ {{ product.roundedPrice }}</td>
            </tr>
          </tbody>
          <tbody class="font-mono" v-else-if="!products?.length && isFetched">
            <tr>
              <td class="p-2 text-gray-500" colspan="7">No se encontraron resultados.</td>
            </tr>
          </tbody>
          <tfoot v-if="paginate && paginate.lastPage > 1" class="border-t bg-gray-100">
            <tr>
              <td colspan="7" class="p-2">
                <Paginator :current-page="paginate.currentPage" :last-page="paginate.lastPage" @change="changePage" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
