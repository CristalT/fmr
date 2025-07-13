<script lang="ts" setup>
import MainHeader from '~/components/MainHeader.vue'
import MainLayout from '~/components/MainLayout.vue'
import ProductImage from '~/components/ProductImage.vue'
import type CartItem from '#models/cart_item'
import http from '~/shared/http';
import { toLocaleNumber } from '~/shared/utils'
import { Button, Input, Icon, Dialog } from '~/components/ui'
import { computed, ref } from 'vue'
import { useCart, useConfirm, useToast } from '~/composables'
import { router } from '@inertiajs/vue3';

const { confirmation } = useConfirm()
const { toast } = useToast()


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

function update() {
  if (qty.value && selectedItem.value) {
    cart.update(selectedItem.value, qty.value).then(() => { window.location.reload() })
    showQtyDialog.value = false
  } else {
    if (!qty.value) {
      throw new Error('Debe ingresar una cantidad')
    }
    if (!selectedItem.value) {
      throw new Error('Debe seleccionar un producto')
    }
  }
}
async function remove(item: CartItem) {
  const conf = await confirmation({
    title: 'Eliminar',
    message: `¿Desea eliminar el producto ${item.name}?`,
    confirm: 'Eliminar',
    cancel: 'Cancelar'
  })

  if (conf) {
    cart
      .remove(item)
      .catch(console.error)
  }
}

async function createOrder() {
  const conf = await confirmation({
    title: 'Nuevo pedido',
    message: `Está por enviar el carrito y generar un pedido. ¿Desea continuar?`,
    confirm: 'Enviar',
    cancel: 'Cancelar'
  })
  if (!conf) return
  http('orders').post({}).then(() => {
    toast.success('Pedido enviado! Gracias por su compra.')
    router.get('cart-items')
  }).catch(err => {
    console.error(err)
    toast.error('Ocurrió un error al enviar el pedido.')
  })
}
</script>
<template>
  <MainLayout whatsapp-hidden>
    <template #header>
      <MainHeader />
    </template>
    <div class="bg-white rounded-md" v-if="cartItems.length">
      <table class="bg-white rounded-md shadow-md mx-auto w-full overflow-hidden">
        <thead>
          <tr class="bg-white border-b">
            <th class="py-2 px-4 text-center">Imagen</th>
            <th class="py-2 px-4 text-center">Código</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-right">Precio</th>
            <th class="py-2 px-4 text-center">Cantidad</th>
            <th class="py-2 px-4 text-right">Importe</th>
            <th class="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of cartItems" :key="item.code" class="border-b">
            <td class="py-2 px-4 flex justify-center">
              <ProductImage :product="item.product" class="h-20 w-20" rounded />
            </td>
            <td class="py-2 px-4 text-center">{{ item.code }}</td>
            <td class="py-2 px-4">{{ item.name }}</td>
            <td class="py-2 px-4 currency">{{ toLocaleNumber(item.product.price) }}</td>
            <td class="py-2 px-4 text-center">{{ item.quantity }}</td>
            <td class="py-2 px-4 currency">{{ amount(item) }}</td>
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

    <div v-else class="text-gray-600 text-center py-4 flex flex-col gap-2">
      <div class="text-lg font-bold">Tu carrito de compras está vacío</div>
      <div class="text-sm">Para agregar productos, consultá nuestro <a href="/products" class="text-primary">catálogo</a></div>
      <div class="text-sm">Si querés conocer el estado de tus pedidos, <a href="/orders" class="text-primary">ingresá al historial de pedidos</a></div>
    </div>

    <Dialog v-model="showQtyDialog">
      <div class="p-4 bg-white flex items-center gap-4 rounded-md shadow-md">
        <div>
          <ProductImage :product="selectedItem?.product!" class="w-[150px]" rounded />
        </div>
        <div class="flex flex-col gap-2 w-[300px]">
          <div class="text-gray-600 font-mono">{{ selectedItem?.code }}</div>
          <div>{{ selectedItem?.name }}</div>
          <Input autofocus type="number" placeholder="Cantidad" v-model="qty" />
          <div class="flex justify-end gap-2">
            <Button variant="tertiary" label="Cancelar" @click="showQtyDialog = false" />
            <Button variant="primary" label="Aceptar" @click="update" />
          </div>
        </div>
      </div>
    </Dialog>
    <template #footer>
      <nav class="flex justify-end gap-2 p-2 bg-gray-100 border-t shadow-sm" v-if="cart.length.value">
        <Button label="Enviar" variant="primary" @click="createOrder">
          <template #icon>
            <Icon name="send" />
          </template>
        </Button>
      </nav>
    </template>
  </MainLayout>
</template>
