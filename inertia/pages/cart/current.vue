<script lang="ts" setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'

import { MainHeader, MainLayout, ProductImage, SetCartQtyDialog } from '~/components'
import { Button, Icon } from '~/components/ui'

import { toLocaleNumber } from '~/shared/utils'
import { useCart, useConfirm } from '~/composables'

import type CartItem from '#models/cart_item'

const { confirmation } = useConfirm()

const showQtyDialog = ref(false)
const qty = ref(1)
const selectedItem = ref<CartItem>()

const cart = useCart()

const cartItems = computed(() => cart.items.value)

function amount(item: CartItem) {
  const sum = Math.floor(item.product.price * item.quantity)

  return toLocaleNumber(sum)
}

function edit(item: CartItem) {
  selectedItem.value = item
  qty.value = item.quantity
  showQtyDialog.value = true
}

function update({ qty }: { qty: number }) {
  if (!qty || !selectedItem.value) {
    throw new Error('Debe ingresar una cantidad y seleccionar un producto')
  }

  cart.update(selectedItem.value, qty).then(() => {
    window.location.reload()
  })
}

async function remove(item: CartItem) {
  const conf = await confirmation({
    title: 'Eliminar',
    message: `¿Desea eliminar el producto ${item.product.name}?`,
    confirm: 'Eliminar',
    cancel: 'Cancelar',
  })

  if (conf) {
    cart.remove(item).catch(console.error)
  }
}

async function createOrder() {
  const conf = await confirmation({
    title: 'Nuevo pedido',
    message: `Está por enviar el carrito y generar un pedido. ¿Desea continuar?`,
    confirm: 'Enviar',
    cancel: 'Cancelar',
  })
  if (!conf) return

  router.post('/orders', {})
}
</script>
<template>
  <MainLayout whatsapp-hidden>
    <template #header>
      <MainHeader />
    </template>
    <div class="rounded-md bg-white" v-if="cartItems.length">
      <table class="mx-auto w-full overflow-hidden rounded-md bg-white shadow-sm">
        <thead>
          <tr class="border-b bg-white">
            <th class="px-4 py-2 text-center">Imagen</th>
            <th class="px-4 py-2 text-center">Código</th>
            <th class="px-4 py-2 text-left">Nombre</th>
            <th class="px-4 py-2 text-right">Precio</th>
            <th class="px-4 py-2 text-center">Cantidad</th>
            <th class="px-4 py-2 text-right">Importe</th>
            <th class="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of cartItems" :key="item.product.code" class="border-b">
            <td class="flex justify-center px-4 py-2">
              <ProductImage :product="item.product" class="h-20 w-20" rounded />
            </td>
            <td class="px-4 py-2 text-center">{{ item.product.code }}</td>
            <td class="px-4 py-2">{{ item.product.name }}</td>
            <td class="currency px-4 py-2">{{ toLocaleNumber(item.product.price) }}</td>
            <td class="px-4 py-2 text-center">{{ item.quantity }}</td>
            <td class="currency px-4 py-2">{{ amount(item) }}</td>
            <td>
              <div class="flex items-center justify-center">
                <Button variant="tertiary" class="mr-2" @click="edit(item)">
                  <template #icon>
                    <Icon name="edit" size="sm" />
                  </template>
                </Button>
                <Button variant="tertiary" class="mr-2" @click="remove(item)">
                  <template #icon>
                    <Icon name="delete" size="sm" />
                  </template>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="flex flex-col gap-2 py-4 text-center text-gray-600">
      <div class="text-lg font-bold">Tu carrito de compras está vacío</div>
      <div class="text-sm">
        Para agregar productos, consultá nuestro
        <a href="/products" class="text-primary">catálogo</a>
      </div>
      <div class="text-sm">
        Si querés conocer el estado de tus pedidos,
        <a href="/orders" class="text-primary">ingresá al historial de pedidos</a>
      </div>
    </div>

    <SetCartQtyDialog
      v-if="selectedItem"
      v-model:visible="showQtyDialog"
      v-model:qty="selectedItem.quantity"
      title="Modificar Cantidad"
      :product="selectedItem.product"
      @update="update" />

    <template #footer>
      <nav
        class="flex justify-end gap-2 border-t bg-gray-100 p-2 shadow-sm"
        v-if="cart.length.value">
        <Button label="Enviar" variant="primary" @click="createOrder">
          <template #icon>
            <Icon name="send" />
          </template>
        </Button>
      </nav>
    </template>
  </MainLayout>
</template>
