<script setup lang="ts">
import { ref } from 'vue'
import { Button, Icon } from '~/components/ui'
import { ProductImage, SetCartQtyDialog } from '~/components'
import { useCart, useToast, useCustomer } from '~/composables'
import { router } from '@inertiajs/vue3'
import type Product from '#models/product'

const { isLoggedIn } = useCustomer()
const cart = useCart()
const showQtyDialog = ref(false)
const qty = ref(1)

const { toast } = useToast()

const props = defineProps<{
  product: Product
}>()

function addToCart({ qty }: { qty: number }) {
  if (qty) {
    cart
      .add(props.product, qty)
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
  <div class="overflow-hidden rounded-md border bg-white shadow-sm">
    <div class="flex h-[200px] justify-center pt-4">
      <ProductImage :product rounded />
    </div>
    <div class="p-2 text-center text-sm font-bold uppercase text-gray-500">
      {{ product.code }}
      <span v-if="isLoggedIn">{{ product.provider }} {{ product.brand }}</span>
    </div>
    <div class="h-14 p-2 text-center text-sm uppercase">
      {{ product.name }}
    </div>
    <div v-if="product.price" class="py-4 text-center text-lg font-medium">
      $ {{ product.price }}
    </div>

    <div class="p-2">
      <Button
        variant="primary"
        full
        label="Agregar al Carrito"
        v-if="isLoggedIn"
        @click="showQtyDialog = true">
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
        @click="router.get(`/contact/${product.id}`)" />
    </div>
  </div>

  <SetCartQtyDialog
    v-model:visible="showQtyDialog"
    v-model:qty="qty"
    :product="product"
    title="Agregar al Carrito"
    @update="addToCart" />
</template>
