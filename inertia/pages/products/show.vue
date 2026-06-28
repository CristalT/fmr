<script setup lang="ts">
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import { ProductImage, SetCartQtyDialog } from '~/components'
import { Button, Card, Icon } from '~/components/ui'
import { useCart, useToast, useCustomer } from '~/composables'
import type Product from '#models/product'

const { product } = defineProps<{ product: Product }>()

const { isLoggedIn } = useCustomer()
const cart = useCart()
const showQtyDialog = ref(false)
const qty = ref(1)

const { toast } = useToast()

const isInCart = computed(() => cart.items.value.some((item) => item.productId === product.id))

function addToCart({ qty }: { qty: number }) {
  if (qty) {
    cart
      .add(product, qty)
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
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>

    <button
      type="button"
      class="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      @click="router.get('/products')">
      <Icon name="chevronLeft" size="sm" />
      Volver al catálogo
    </button>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="flex h-[320px] items-center justify-center rounded-md border bg-white p-4 shadow-sm md:h-[420px]">
        <ProductImage :product rounded class="h-full" />
      </div>

      <Card class="flex flex-col">
        <div class="text-center text-sm font-bold uppercase text-gray-500">
          {{ product.code }}
          <span v-if="isLoggedIn">{{ product.provider }} {{ product.brand }}</span>
        </div>
        <h1 class="py-2 text-center text-xl uppercase">{{ product.name }}</h1>
        <div v-if="product.price" class="py-4 text-center text-3xl font-medium">
          $ {{ product.price }}
        </div>

        <div class="mt-auto pt-4">
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
      </Card>
    </div>

    <Card v-if="product.description" title="Descripción" class="mt-4">
      <p class="whitespace-pre-line text-sm text-gray-700">{{ product.description }}</p>
    </Card>

    <Card v-if="product.details" title="Detalles" class="mt-4">
      <p class="whitespace-pre-line text-sm text-gray-700">{{ product.details }}</p>
    </Card>

    <SetCartQtyDialog
      v-model:visible="showQtyDialog"
      v-model:qty="qty"
      :product="product"
      title="Agregar al Carrito"
      @update="addToCart" />
  </MainLayout>
</template>
