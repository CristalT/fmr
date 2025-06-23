<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/components/AdminLayout.vue'
import { Input } from '~/components/ui'
import Paginator from '~/components/Paginator.vue'
import ProductImage from '~/components/ProductImage.vue'
import ProviderSelect from '~/components/ProviderSelect.vue'
import Product from '#models/product'
import { useDebounceFn } from '@vueuse/core'
import { Meta } from '~/types/metadata'

const params = ref({
  terms: '',
  page: 1,
  filter: {
    provider: '',
  },
})

const props = defineProps<{ data: { data: Product [], meta: Meta } }>()

const products = computed(() => props.data.data)
const metadata = computed(() => props.data.meta)


params.value.page = metadata.value.currentPage

function openEdit(productId: string) {
  router.get(`/admin/products/${productId}`)
}

const search = useDebounceFn(() => {
  router.get('/admin/products', params.value)
}, 1000)

onMounted(() => {
  const reload = window.location.search.includes('reload')
  if (reload) {
    window.location.href = window.location.href.replace('?reload', '')
  }
})
</script>

<template>
  <AdminLayout>

    <div class="p-2 bg-white shadow-sm rounded-md flex gap-2">
      <div class="basis-9/12">
        <Input v-model="params.terms" placeholder="Buscar ..." @update:model-value="search" />
      </div>
      <div class="basis-3/12">
        <ProviderSelect v-model="params.filter.provider" @change="search" placeholder="Proveedor" />
      </div>
    </div>
    <table class="bg-white rounded-md shadow-md mx-auto w-full">
      <thead class="table w-full table-fixed border-b">
        <tr>
          <th class="w-[100px]"></th>
          <th class="w-[120px] p-2 text-left">Código</th>
          <th class="w-[65px] p-2 text-left">Prov.</th>
          <th class="w-[600px] p-2 text-left">Descripción</th>
          <th class="w-[120px] p-2 text-center">Ubicación</th>
          <th class="w-[80px] p-2 text-center">Stock</th>
          <th class="w-[80px] p-2 text-right">Precio</th>
        </tr>
      </thead>
      <tbody class="overflow-auto block h-[calc(100vh-250px)]" v-if="products.length">
        <tr
          v-for="product of products"
          :key="product.id"
          class="table-fixed table w-full border-b hover:bg-gray-100 cursor-pointer"
          :class="{ 'opacity-30': !product.public }"
          @click="openEdit(product.id)"
        >
          <td class="p-2 w-[100px] text-center">
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
      <tbody class="font-mono" v-else>
        <tr>
          <td class="p-2 text-gray-500" colspan="7">No se encontraron resultados.</td>
        </tr>
      </tbody>
      <tfoot v-if="metadata.lastPage > 1" class="border-t">
        <tr>
          <td colspan="7" class="p-2">
            <Paginator
              v-model="params.page"
              :current-page="metadata.currentPage"
              :last-page="metadata.lastPage"
              @update:model-value="router.get('/admin/products', params)"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </AdminLayout>
</template>
