<script setup lang="ts">
import { Button, Icon } from '~/components/ui'

import { router } from '@inertiajs/vue3';
import { useCart, useCustomer } from '~/composables'

const cart = useCart()
const customer = useCustomer()

</script>
<template>
  <div id="customer-tools" class="bg-logo flex justify-between items-center p-2 shadow-sm" v-if="customer.isLoggedIn.value">
    <div class="flex gap-4">
    </div>
    <ul class="flex gap-4">
      <li>
        <Button label="Historial de Pedidos" variant="tertiary" @click="router.get('/orders')">
          <template #icon>
            <Icon name="orders" />
          </template>
        </Button>
      </li>
      <li>
        <Button label="Carrito" variant="tertiary" @click="router.get('/carts')" :badge="cart.length.value">
          <template #icon>
            <Icon name="cart" />
          </template>
        </Button>
      </li>
    </ul>
  </div>
</template>
