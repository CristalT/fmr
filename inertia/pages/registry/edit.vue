<script setup lang="ts">
import { AdminLayout } from '~/components'
import { Button, Card, Input } from '~/components/ui'
import { Registry } from '~/types/registry'
import { useForm } from '@inertiajs/vue3'

const props = defineProps<{ registry: Registry }>()

const registry = useForm<Registry>({ ...props.registry })

async function onSubmit() {
  registry.post('/admin/customers')
}
</script>
<template>
  <form @submit.prevent="onSubmit">
    <AdminLayout>
      <Card class="w-full">
        <template #header>
          <h1 class="text-xl font-bold">Solicitud de Usuario</h1>
        </template>
        <div class="flex flex-col gap-2">
          <Input label="Nombre" v-model="registry.firstName" :error="registry.errors.firstName" />
          <Input label="Apellido" v-model="registry.lastName" :error="registry.errors.lastName" />
          <Input label="DNI / CUIL / CUIT" v-model="registry.dni" :error="registry.errors.dni" />
          <Input label="Email" v-model="registry.email" :error="registry.errors.email" />
          <Input label="Teléfono" v-model="registry.phone" :error="registry.errors.phone" />
          <Input label="Dirección" v-model="registry.address" :error="registry.errors.address" />
          <Input
            label="Código Postal"
            v-model="registry.postalCode"
            :error="registry.errors.postalCode" />
          <Input label="Localidad" v-model="registry.city" :error="registry.errors.city" />
          <Input label="Provincia" v-model="registry.province" :error="registry.errors.province" />
        </div>
      </Card>
      <template #footer>
        <div class="flex justify-end">
          <Button type="submit" label="Crear Usuario" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
