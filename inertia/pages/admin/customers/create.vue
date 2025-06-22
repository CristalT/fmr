<script setup lang="ts">
import Input from '~/components/ui/input/Input.vue'
import { Button } from '~/components/ui'
import AdminLayout from '~/components/AdminLayout.vue'
import { Customer } from '~/types/customer'
import { useForm } from '@inertiajs/vue3'

const form = useForm<Customer>({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
})
</script>
<template>
  <AdminLayout>
    <form @submit.prevent="form.post('/admin/customers')">
      <div class="bg-white shadow-md p-4 rounded-md flex flex-col gap-2">
        <div>
          <Input v-model="form.firstName" label="Nombre" :error="form.errors.firstName" />
        </div>
        <div>
          <Input v-model="form.lastName" label="Apellido" :error="form.errors?.lastName" />
        </div>
        <div>
          <Input type="email" v-model="form.email" label="Email" :error="form.errors.email" />
        </div>
        <div>
          <Input id="phone" v-model="form.phone" label="Teléfono" :error="form.errors.phone" />
        </div>
        <div class="text-center">
          <Button type="submit" :disabled="form.processing" label="Aceptar" />
        </div>
      </div>
    </form>
  </AdminLayout>
</template>
