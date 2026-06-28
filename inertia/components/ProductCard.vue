<script setup lang="ts">
import { computed, ref } from 'vue'
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

const isInCart = computed(() =>
  cart.items.value.some((item) => item.productId === props.product.id)
)

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
  <div
    class="overflow-hidden rounded-md border bg-white shadow-sm transition-shadow hover:shadow-md">
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
    <div v-if="product.price" class="py-4 text-center text-2xl font-medium">
      $ {{ product.price }}
    </div>

    <button
      type="button"
      class="flex w-full items-center justify-center gap-1 pb-2 text-sm text-primary hover:underline"
      @click="router.get(`/products/${product.id}`)">
      <Icon name="eye" size="sm" />
      Ver más
    </button>

    <div class="p-2">
      <Button
        :variant="isInCart ? 'success' : 'primary'"
        full
        :label="isInCart ? 'Agregar Más' : 'Agregar al Carrito'"
        v-if="isLoggedIn"
        @click="showQtyDialog = true">
        <template #icon>
          <Icon name="add" />
        </template>
      </Button>
      <Button
        variant="primary"
        bordered
        full
        label="Consultar"
        v-else
        @click="router.get(`/contact/${product.id}`)" />
    </div>

    <SetCartQtyDialog
      v-model:visible="showQtyDialog"
      v-model:qty="qty"
      :product="product"
      title="Agregar al Carrito"
      @update="addToCart" />
  </div>
</template>
