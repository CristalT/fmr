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
  <Card>
    <template #header>
      <h2 class="text-lg font-medium text-gray-900">{{ title }}</h2>
    </template>
    <Input v-model="form.firstName" label="Nombre" :error="form.errors.firstName" />
    <Input v-model="form.lastName" label="Apellido" :error="form.errors?.lastName" />
    <Input label="DNI / CUIL / CUIT" v-model="form.dni" :error="form.errors?.dni" />
    <Input type="email" v-model="form.email" label="Email" :error="form.errors.email" />
    <Input id="phone" v-model="form.phone" label="Teléfono" :error="form.errors.phone" />
    <Input id="address" v-model="form.address" label="Dirección" :error="form.errors.address" />
    <Input id="city" v-model="form.city" label="Ciudad" :error="form.errors.city" />
    <Input id="province" v-model="form.province" label="Provincia" :error="form.errors.province" />
    <Input id="postalCode" v-model="form.postalCode" label="Código postal" :error="form.errors.postalCode" />
  </Card>
</template>
