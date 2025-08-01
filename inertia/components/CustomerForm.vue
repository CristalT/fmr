<script setup lang="ts">
import { Card, Input } from '~/components/ui'
import { useCustomer } from '~/composables'
import { onUnmounted } from 'vue'

const { form } = useCustomer()

defineProps<{ title: string }>()

onUnmounted(() => {
  form.reset()
})
</script>
<template>
  <Card :title>
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <Input
          v-model="form.firstName"
          label="Nombre"
          :error="form.errors.firstName"
          class="basis-3/6" />
        <Input
          v-model="form.lastName"
          label="Apellido"
          :error="form.errors?.lastName"
          class="basis-3/6" />
      </div>
      <div class="flex gap-2">
        <Input
          label="DNI / CUIL / CUIT"
          v-model="form.dni"
          :error="form.errors?.dni"
          class="basis-3/6" />
        <Input
          type="email"
          v-model="form.email"
          label="Email"
          :error="form.errors.email"
          class="basis-3/6" />
      </div>
      <div class="flex gap-2">
        <Input v-model="form.phone" label="Teléfono" :error="form.errors.phone" class="basis-3/6" />
        <Input
          v-model="form.address"
          label="Dirección"
          :error="form.errors.address"
          class="basis-3/6" />
      </div>
      <div class="flex gap-2">
        <Input
          v-model="form.postalCode"
          label="Código postal"
          :error="form.errors.postalCode"
          class="basis-1/6" />
        <Input v-model="form.city" label="Ciudad" :error="form.errors.city" class="basis-2/6" />
        <Input
          v-model="form.province"
          label="Provincia"
          :error="form.errors.province"
          class="basis-3/6" />
      </div>
    </div>
  </Card>

  <Card class="mt-2" title="Opciones de eShop">
    <div class="py-2">
      <Input type="boolean" v-model="form.paymentOnDelivery" label="Pago contra entrega" />
    </div>
  </Card>
</template>
