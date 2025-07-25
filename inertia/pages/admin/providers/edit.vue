<script setup lang="ts">
import type Provider from '#models/provider'
import { router, useForm } from '@inertiajs/vue3'
import { AdminLayout } from '~/components'
import { Card, Input, Button, Icon } from '~/components/ui'

const { provider } = defineProps<{ provider: Provider }>()

const form = useForm({
  alias: provider.alias,
  name: provider.name,
  email: provider.email,
})

</script>
<template>
  <form @submit.prevent="form.put(`/admin/providers/${provider.alias}`)">
    <AdminLayout>
      <template #topbar>
        <Button label="Volver" variant="tertiary" @click="router.visit('/admin/providers/list')">
          <template #icon>
            <Icon name="chevronLeft" />
          </template>
        </Button>
      </template>
      <div class="flex flex-col gap-2">
        <Card>
          <template #header>
            <h2 class="text-lg font-medium text-gray-900">Editar proveedor</h2>
          </template>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <Input v-model="form.alias" disabled class="basis-1/4" label="ID" :error="form.errors.alias" />
              <Input v-model="form.name" class="basis-3/4" label="Razón Social" :error="form.errors.name" />
            </div>
            <Input v-model="form.email" type="email" label="Email" :error="form.errors.email" />
          </div>
        </Card>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <Button type="submit" label="Aceptar" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
