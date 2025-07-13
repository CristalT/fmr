<script setup lang="ts">
import { Button } from '~/components/ui'
import { AdminLayout } from '~/components'
import { useCustomer } from '~/composables'
import CustomerForm from '~/components/CustomerForm.vue'

const { form } = useCustomer()

</script>
<template>
  <form @submit.prevent="form.post('/admin/customers')">
  <AdminLayout>
      <CustomerForm title="Crear cliente"  />
      <template #footer>
        <div class="flex justify-end">
          <Button type="submit" :disabled="form.processing" label="Aceptar" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
