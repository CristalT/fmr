<script setup lang="ts">
import { AdminLayout } from '~/components'
import ProductImage from '~/components/ProductImage.vue'
import ProviderSelect from '~/components/ProviderSelect.vue'
import { Button, Icon } from '~/components/ui'

import { computed, watch, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { router } from '@inertiajs/vue3'
import { Input, Paginator, Toggle } from '~/components/ui'
import { useStock } from '~/composables'

const { fetchAll } = useStock()

const params = useLocalStorage('adminProductsSearchParams', {
  terms: '',
  page: 1,
  filter: {
    provider: '',
  },
  onlyPublic: false,
})

const { data, isFetched } = fetchAll(params)

// Reset page number when search or filter changes
watch(
  () => {
    const { terms, filter, onlyPublic } = params.value
    return { terms, filter, onlyPublic }
  },
  () => params.value.page = 1,
  { deep: true }
)

const products = computed(() => data.value?.data)
const lastPage = computed(() => data.value?.meta?.lastPage || 1)

function openEdit(productId: string) {
  router.get(`/admin/stock/${productId}`)
}

// Context menu state
const showContextMenu = ref(false)

</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex justify-end">
        <Button variant="primary" label="Crear Producto" @click="router.visit('/admin/stock/create')" />
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div class="p-2 bg-white shadow-sm rounded-md flex gap-2">
        <div class="basis-9/12">
          <Input v-model="params.terms" placeholder="Buscar ..." :debounce="500" autofocus clearable />
        </div>
        <div class="basis-3/12 ">
          <ProviderSelect v-model="params.filter.provider" placeholder="Proveedor" />
        </div>
        <div class="relative">
          <Button title="Opciones" variant="tertiary" @click="showContextMenu = !showContextMenu" class="relative">
            <template #icon>
              <Icon name="adjustments" />
            </template>
          </Button>
          <div v-if="showContextMenu"
            class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            @click.stop>
            <div class="py-1">
              <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                Opciones
              </div>
              <div class="flex flex-col gap-2 p-2">
                <Toggle v-model="params.onlyPublic" size="sm" label="Sólo públicos" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-md overflow-hidden shadow-sm">
        <table class="bg-white w-full text-sm">
          <thead class="table w-full table-fixed border-b-2 ">
            <tr>
              <th class="w-[100px]">Foto</th>
              <th class="w-[120px] py-2 px-4 text-center">Código</th>
              <th class="w-[145px] py-2 px-4 text-center">Catálogo</th>
              <th class="w-[65px] py-2 px-4 text-left">Prov.</th>
              <th class="w-[500px] py-2 px-4 text-left">Descripción</th>
              <th class="w-[120px] py-2 px-4 text-center">Ubicación</th>
              <th class="w-[70px] py-2 px-4 text-center">Stock</th>
              <th class="w-[80px] py-2 px-4 text-right">Precio</th>
            </tr>
          </thead>
          <tbody class="overflow-auto block h-[calc(100vh-200px)]" v-if="products?.length">
            <tr v-for="product of products" :key="product.id"
              class="table-fixed table w-full border-b hover:bg-gray-100 cursor-pointer"
              :class="{ 'opacity-30': !product.public }" @click="openEdit(product.id)">
              <td class="p-2 w-[100px] h-20 text-center border-r">
                <ProductImage rounded :product class="w-20 mx-auto" />
              </td>
              <td class="p-2 w-[120px] border-r text-center">{{ product.code }}</td>
              <td class="p-2 w-[145px] border-r text-center">{{ product.factoryCode }}</td>
              <td class="p-2 w-[65px] border-r text-center">{{ product.provider }}</td>
              <td class="p-2 w-[500px] border-r">{{ product.name }}</td>
              <td class="p-2 w-[120px] border-r text-center text-xs">{{ product.location }}</td>
              <td class="p-2 w-[70px] border-r text-center">{{ product.stock }}</td>
              <td class="pr-4 w-[80px] text-right">$ {{ product.price }}</td>
            </tr>
          </tbody>
          <tbody class="font-mono" v-else-if="!products?.length && isFetched">
            <tr>
              <td class="p-2 text-gray-500" colspan="7">No se encontraron resultados.</td>
            </tr>
          </tbody>
          <tfoot v-if="lastPage > 1" class="border-t bg-gray-100">
            <tr>
              <td colspan="7" class="p-2">
                <Paginator v-model="params.page" :last-page="lastPage" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
