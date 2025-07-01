<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Input, Icon } from '~/components/ui'
import ProductImage from './ProductImage.vue'
import { useCart, useToast } from '~/composables'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import { router } from '@inertiajs/vue3'
import type Product from '#models/product'


const cart = useCart()
const showQtyDialog = ref(false)
const qty = ref(1)

const { toast } = useToast()

const props = defineProps<{
  product: Product
}>()

const isLoggedInView = computed(() => props.product.price !== undefined)

function addToCart() {
  if (qty.value) {
    cart
      .add(props.product, qty.value)
      .then(() => toast.success('Producto agregado al carrito'))
      .catch(({ response }) => {
        toast.error(response.data)
      })
      .finally(() => {
        showQtyDialog.value = false
      })
  }
}
</script>

<template>
  <div class="rounded-md overflow-hidden bg-white border shadow-sm">
    <div class="flex justify-center h-[200px] pt-4">
      <ProductImage :product rounded />
    </div>
    <div class="text-center p-2 text-sm uppercase text-gray-500 font-bold">
      {{ product.code }} <span v-if="isLoggedInView">{{ product.provider }} {{ product.brand }}</span>
    </div>
    <div class="text-center p-2 h-14 text-sm uppercase">
      {{ product.name }}
    </div>
    <div v-if="product.price" class="text-center py-4 font-medium text-lg">$ {{ product.price }}</div>

    <div class="p-2">
      <Button
        variant="primary"
        full
        label="Agregar al Carrito"
        v-if="isLoggedInView"
        @click="showQtyDialog = true"
      >
      <template #icon>
        <Icon name="add" />
      </template>
      </Button>
      <Button
        variant="tertiary"
        bordered
        full
        label="Consultar"
        v-else
        @click="router.get(`/contact/${product.id}`)"
      />
    </div>
  </div>

  <Dialog v-model="showQtyDialog">
    <form @submit.prevent="addToCart" class="p-4 bg-white flex items-center gap-4 rounded-md shadow-md">
      <div>
        <ProductImage :product class="w-[300px]" rounded />
      </div>
      <div class="flex flex-col gap-2 w-[300px]">
        <div class="text-gray-600 font-mono">{{ product.code }}</div>
        <div>{{ product.name }}</div>
        <Input type="number" placeholder="Cantidad" v-model="qty" autofocus label="Cantidad" />
        <div class="flex justify-end gap-2">
          <Button variant="tertiary" label="Cancelar" @click="showQtyDialog = false" />
          <Button type="submit" variant="primary" label="Aceptar" />
        </div>
      </div>
    </form>
  </Dialog>
</template>
