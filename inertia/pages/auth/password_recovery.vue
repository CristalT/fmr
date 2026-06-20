<script setup lang="ts">
import { Input, Button } from '~/components/ui'

import { useForm } from '@inertiajs/vue3';
import MainLayout from '~/components/MainLayout.vue';

const form = useForm({
  email: '',
});
</script>

<template>
  <MainLayout class="min-h-screen">
    <div class="h-screen flex items-center mt-[-50px]">
      <form @submit.prevent="form.post('/auth/password-recovery')" class="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-6">Nueva contraseña</h1>
        <p class="text-gray-600 mb-4">Ingresá tu correo electrónico, te enviaremos un mensaje para generar una nueva
          contraseña.</p>

        <Input v-model="form.email" type="email" label="Correo electrónico" placeholder="Correo electrónico" required
          class="mb-4" :error="form.errors.email" />
        <Button type="submit" class="w-full" label="Aceptar" />
      </form>
    </div>
  </MainLayout>

</template>
