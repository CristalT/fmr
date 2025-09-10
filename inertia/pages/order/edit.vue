<script setup lang="ts">
import type Order from '#models/order'
import { isEmpty, sumBy } from 'lodash-es'
import { computed } from 'vue'
import ProductImage from '~/components/ProductImage.vue'
import { Card, Input } from '~/components/ui'
import MercadoPagoButton from '~/components/MercadoPagoButton.vue'
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'

const { order, paymentMethods } = defineProps<{
  order: Order
  paymentMethods: Record<string, any>
}>()

const total = computed(() => sumBy(order.cartItems, (item) => item.product.price * item.quantity))

const hasPaymentMethods = !isEmpty(paymentMethods)
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <h1 class="mb-4 text-2xl font-bold">Orden #{{ order.id }}</h1>
    <div class="mb-2 flex gap-2">
      <div class="col-span-1 flex basis-2/3 flex-col gap-2">
        <!-- Customer Data form -->
        <Card title="Datos del Cliente">
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <Input
                type="text"
                v-model="order.customer.firstName"
                label="Nombre"
                class="basis-1/2" />
              <Input
                type="text"
                v-model="order.customer.lastName"
                label="Apellido"
                class="basis-1/2" />
            </div>

            <Input type="text" v-model="order.customer.dni" label="DNI / CUIL / CUIT" />

            <div class="flex gap-2">
              <Input type="email" v-model="order.customer.email" label="Email" class="basis-1/2" />
              <Input
                type="text"
                v-model="order.customer.phone"
                label="Teléfono"
                class="basis-1/2" />
            </div>
            <div class="flex gap-2">
              <Input
                type="text"
                v-model="order.customer.address"
                label="Dirección"
                class="basis-1/2" />
              <Input type="text" v-model="order.customer.city" label="Ciudad" class="basis-1/2" />
            </div>
            <div class="flex gap-2">
              <Input
                type="text"
                v-model="order.customer.province"
                label="Provincia"
                class="basis-1/2" />
              <Input
                type="text"
                v-model="order.customer.postalCode"
                label="Código Postal"
                class="basis-1/2" />
            </div>
            <div>
              <Input type="textarea" label="Notas" />
            </div>
          </div>
        </Card>
      </div>
      <Card class="col-span-2 basis-1/3 overflow-hidden" title="Resumen del Pedido">
        <div class="max-h-[600px] overflow-y-auto pb-6 scrollbar-thin">
          <ul class="divide-y divide-gray-200 px-2">
            <li v-for="item in order.cartItems" :key="item.id" class="flex gap-2 py-2 text-sm">
              <ProductImage
                :product="item.product"
                alt="Product Image"
                class="h-12 w-12 basis-1/12" />
              <div class="flex basis-11/12 flex-col gap-1 text-gray-800">
                <div class="text-xs">{{ item.product.code }}</div>
                <div class="text-sm">{{ item.product.name }}</div>
                <div class="text-right text-xs font-semibold">
                  {{ item.quantity }} x {{ item.product.price }}
                </div>
              </div>
            </li>
          </ul>
        </div>

        <template #footer>
          <div class="mt-4 flex justify-between">
            <span>Total</span>
            <span class="font-bold">$ {{ total }}</span>
          </div>
        </template>
      </Card>
    </div>

    <Card v-if="hasPaymentMethods" title="Métodos de Pago">
      <div v-for="(method, key) in paymentMethods">
        <MercadoPagoButton
          v-if="key === 'mercadopago'"
          :preference="method.preference"
          :mp-public-key="method.publicKey" />
      </div>
    </Card>
  </MainLayout>
</template>
