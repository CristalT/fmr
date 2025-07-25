<script lang="ts" setup>
import { Input, Card, Table, Icon, Button } from '~/components/ui';
import { computed, ref } from 'vue';
import type Product from '#models/product'
import { useProduct } from '~/composables'
import ProductImage from '~/components/ProductImage.vue';

const { selectedProducts = [] } = defineProps<{ selectedProducts?: Product[] }>()
const params = ref({
  terms: '',
  page: 1,
})

const { data } = useProduct().fetchAll(params)
const products = computed(() => data.value?.data || [])
const metadata = computed(() => data.value?.meta)

const selected = defineModel<string[]>({ required: true })
const _selectedProducts = ref<Product[]>(selectedProducts || []);

const addProduct = (product: Product) => {
  if (!selected.value.includes(product.id)) {
    selected.value.push(product.id)
    _selectedProducts.value.push(product)
  }
}

const removeProduct = (product: Product) => {
  const idx = selected.value.indexOf(product.id)
  selected.value.splice(idx, 1)
  _selectedProducts.value.splice(idx, 1)
}

</script>
<template>
    <div class="flex gap-2 items-start mt-2">
      <div class="basis-3/6 flex flex-col gap-2">
        <Card>
          <div class="text-gray-600 font-bold mb-2">Seleccionar Artículos</div>
          <Input v-model="params.terms" placeholder="Buscar ..." :debounce="500" class="mb-2" />


          <Table
            class="text-sm"
            :columns="[
              { label: 'Código', key: 'code' },
              { label: 'Descripción', key: 'name' },
            ]"
            :data="products"
            :selected-rows="selected"
            :metadata
            @page-change="(value) => params.page = value"
            @row-click="addProduct"
          >
            <template #prepend="{ row }">
                <ProductImage :product="row" class="w-10 h-10" />
            </template>
          </Table>
        </Card>
      </div>
      <div class="basis-3/6">
        <Card>
          <div class="w-full">
            <div class="text-gray-600 font-bold mb-2 pb-8">Artículos seleccionados</div>
            <Table
            class="text-sm"
            :columns="[
              { label: 'Código', key: 'code' },
              { label: 'Descripción', key: 'name' },
            ]" :data="_selectedProducts">
              <template #prepend="{ row }">
                <ProductImage :product="row" class="w-10 h-10" />
              </template>
              <template #append="{ row }">
                <Button variant="danger" flat @click="removeProduct(row)">
                  <template #icon>
                    <Icon name="delete" class="text-red-500" />
                  </template>
                </Button>
              </template>
            </Table>
          </div>
        </Card>
      </div>
    </div>
</template>
