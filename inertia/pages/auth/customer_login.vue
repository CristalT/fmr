<script lang="ts" setup>
import { Button, Input, Alert } from '~/components/ui'
import { useForm } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps(['errors'])

const form = useForm({
  email: '',
  password: '',
})

const error = computed(() => {
  if (props.errors?.message) {
    return 'Error. Revise sus credenciales de acceso.'
  }
  return ''
})
</script>

<template>
  <div
    class="absolute inset-0 flex h-screen w-screen flex-row items-center justify-center bg-cover bg-center bg-no-repeat"
    style="background-image: url('/static/customer-login-bg.webp')">
    <div
      class="h-full w-full bg-black bg-opacity-40 p-6 sm:p-10 md:w-2/3 md:p-16 lg:w-2/4 lg:p-24 xl:w-2/5">
      <div class="flex flex-col gap-4">
        <h1 class="text-center text-2xl font-semibold uppercase text-white">Acceso Clientes</h1>
        <Alert variant="danger" v-if="error">{{ error }}</Alert>
        <form @submit.prevent="form.post('/auth/customers')">
          <div class="flex flex-col gap-4">
            <div>
              <Input placeholder="Usuario" v-model="form.email" :error="form.errors.email" />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                v-model="form.password"
                :error="form.errors.password" />
            </div>
            <div class="flex justify-center">
              <Button label="Ingresar" type="submit" variant="primary" class="w-full" />
            </div>
            <div class="flex justify-center">
              <a href="/auth/password-recovery" class="text-white underline">
                Olvidé mi contraseña
              </a>
            </div>
            <div class="flex justify-center">
              <a href="/registries/create" class="text-white underline">Quiero ser cliente</a>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="w-0 md:w-1/3 lg:w-2/4 xl:w-3/5"></div>
  </div>
</template>
