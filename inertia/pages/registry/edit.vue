<script setup lang="ts">
import { AdminLayout } from '~/components'
import useValidation from '~/composables/use_validation'
import { Button, Card, Input } from '~/components/ui'
import { toRef } from 'vue';
import { Registry, RegistrySchema } from '~/types/registry';
import { useToast } from '~/composables';
import { router } from '@inertiajs/vue3';

const props = defineProps<{ registry: Registry }>()

const { toast } = useToast()

const registry = toRef(props, 'registry')

const { getError, isValid, validate } = useValidation(RegistrySchema, registry)

async function onSubmit() {
  await validate()

  if (!isValid.value) {
    toast.error('Revise los campos del formulario.')
    return false
  }

  router.post(`/admin/customers`, registry.value)
}
</script>
<template>
  <AdminLayout>
    <form @submit.prevent="onSubmit">
      <Card class="w-full">
        <template #header>
          <h1 class="text-xl font-bold text-gray-700">Solicitud de Usuario</h1>
        </template>
        <div class="flex flex-col gap-2">
          <Input label="Nombre" v-model="registry.firstName" :error="getError('firstName')" />
          <Input label="Apellido" v-model="registry.lastName" :error="getError('lastName')" />
          <Input label="DNI / CUIL / CUIT" v-model="registry.dni" :error="getError('dni')" />
          <Input label="Email" v-model="registry.email" :error="getError('email')" />
          <Input label="Teléfono" v-model="registry.phone" :error="getError('phone')" />
          <Input label="Dirección" v-model="registry.address" :error="getError('address')" />
          <Input label="Código Postal" v-model="registry.postalCode" :error="getError('postalCode')" />
          <Input label="Localidad" v-model="registry.city" :error="getError('city')" />
          <Input label="Provincia" v-model="registry.province" :error="getError('province')" />
        </div>
        <template #footer>
          <Button type="submit" label="Crear Usuario" class="mt-4 w-full" />
        </template>
      </Card>
    </form>

  </AdminLayout>
</template>
