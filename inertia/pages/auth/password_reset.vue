<script setup lang="ts">
import { Input, Button, Alert } from '~/components/ui'

import { useForm, usePage } from '@inertiajs/vue3';
import MainLayout from '~/components/MainLayout.vue';

const page = usePage();
const token = page.url.split('token=')[1] || '';

const form = useForm({
  email: '',
  password: '',
  passwordConfirmation: '',
  token,
});
</script>

<template>
  <MainLayout class="min-h-screen">
    <div class="h-screen flex items-center mt-[-50px]">
      <form @submit.prevent="form.post('/auth/password-reset')" class="max-w-md mx-auto p-6 bg-white rounded shadow">
        <Alert variant="danger" v-if="form.errors.token">Token de seguridad inválido. Es posible que el link para
          recrear tu contraseña haya expirado.</Alert>

        <h1 class="text-2xl font-bold mb-6">Nueva contraseña</h1>
        <p class="text-gray-600 mb-4">Por favor, ingresá tu correo electrónico y creá una contraseña.</p>

        <Input v-model="form.email" type="email" label="Correo electrónico" placeholder="Correo electrónico" required
          class="mb-4" :error="form.errors.email" />

        <Input v-model="form.password" type="password" label="Nueva contraseña" placeholder="Ingresar nueva contraseña"
          required class="mb-4" :error="form.errors.password" />
        <Input v-model="form.passwordConfirmation" type="password" label="Confirmar contraseña"
          placeholder="Repetí tu nueva contraseña" required class="mb-4" :error="form.errors.passwordConfirmation" />
        <Button type="submit" class="w-full" label="Aceptar" />

      </form>
    </div>
  </MainLayout>

</template>
