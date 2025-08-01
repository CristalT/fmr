<script setup lang="ts">
import { Button, Icon } from '~/components/ui'
import { AdminLayout } from '~/components'
import type Customer from '#models/customer'
import CustomerForm from '~/components/CustomerForm.vue'
import { useCustomer, useConfirm } from '~/composables'
import { router } from '@inertiajs/vue3'

const { user } = defineProps<{
  user: Customer
}>()

const { form } = useCustomer()
const { confirmation } = useConfirm()

Object.assign(form, user)

async function deleteUser() {
  const conf = await confirmation({
    title: 'Eliminar cliente',
    message: `¿Estás seguro de que deseas eliminar al cliente ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`,
    confirm: 'Eliminar',
    cancel: 'Cancelar',
    type: 'danger',
  })

  if (conf) {
    form.delete(`/admin/customers/${user.id}`, {
      onSuccess: () => {
        router.visit('/admin/customers/view')
      },
      onError: (error) => {
        console.error('Error deleting customer:', error)
      },
    })
  }
}
</script>
<template>
  <form @submit.prevent="form.put('/admin/customers/' + user.id)">
    <AdminLayout>
      <CustomerForm title="Editar cliente" />
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            variant="danger"
            flat
            @click="deleteUser"
            :disabled="form.processing"
            label="Eliminar">
            <template #icon>
              <Icon name="delete" />
            </template>
          </Button>

          <Button type="submit" :disabled="form.processing" label="Aceptar" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
