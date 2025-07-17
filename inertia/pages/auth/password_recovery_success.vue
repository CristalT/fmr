<script setup>
import { Card, Button } from '~/components/ui';
import MainLayout from '~/components/MainLayout.vue';
</script>

<template>
<MainLayout class="min-h-screen">
  <div class="h-screen flex items-center mt-[-50px]">
    <Card class="max-w-md mx-auto">
      <template #header>
        <h1 class="text-2xl font-bold">Mensaje enviado</h1>
      </template>
      <p class="text-gray-600 mb-4">Hemos enviado un mensaje a tu correo electrónico con las instrucciones para
        restablecer tu contraseña.</p>
      <p class="text-gray-600 mb-4">Si no recibiste el mensaje, revisa tu carpeta de spam o intenta nuevamente.</p>
      <Button @click="$inertia.visit('/auth/customers/show')" class="w-full" label="Volver al inicio de sesión" />
    </Card>
    </div>
  </MainLayout>
</template>
