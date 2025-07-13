<script setup lang="ts">
import { Button } from '~/components/ui'
import { AdminLayout } from '~/components'
import type CustomerUser from '#models/customer_user'
import CustomerForm from '~/components/CustomerForm.vue'
import { useCustomer } from '~/composables'

const { user } = defineProps<{
  user: CustomerUser
}>()

const { form } = useCustomer()

Object.assign(form, user)
</script>
<template>
  <form @submit.prevent="form.put('/admin/customers/' + user.id)">
    <AdminLayout>
      <CustomerForm title="Editar cliente" />
      <template #footer>
        <div class="flex justify-end">
          <Button type="submit" :disabled="form.processing" label="Aceptar" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
