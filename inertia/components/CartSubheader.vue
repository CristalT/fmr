<script setup lang="ts">
import { Button, Icon } from '~/components/ui'
import { computed } from 'vue';
import { toLocaleNumber } from '~/shared/utils';

import http from '~/shared/http';
import { router } from '@inertiajs/vue3';
import { useCart, useToast } from '~/composables'

const cart = useCart()
const { toast } = useToast()

const total = computed(() => {
  const sum = cart.items.value?.reduce((sum, item) => sum + item.product.roundedPrice * item.quantity, 0) || 0
  return toLocaleNumber(sum)
})

function createOrder() {
  http('orders').post({}).then(() => {
    toast.success('Pedido enviado! Gracias por su compra.')
    router.get('carts')
  }).catch(err => {
    console.error(err)
    toast.error('Ocurrió un error al enviar el pedido.')
  })
}
</script>
<template>
  <div class="bg-white flex justify-between items-center p-2 shadow-sm">
    <ul class="flex gap-4">
      <li v-if="cart.items">Total: <b>$ {{ total }}</b></li>
    </ul>
    <div class="flex gap-4">
      <Button label="Pedidos" variant="tertiary" @click="router.get('/orders')">
        <template #icon>
          <Icon name="orders" />
        </template>
      </Button>

      <Button label="Enviar" variant="primary" @click="createOrder" :disabled="!cart.length">
        <template #icon>
          <Icon name="send" />
        </template>
      </Button>
    </div>
  </div>
</template>
