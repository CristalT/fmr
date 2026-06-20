<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import { Button } from '~/components/ui'
import { router } from '@inertiajs/vue3'
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div class="flex flex-col items-center gap-4 py-24 text-center">
      <div class="text-6xl font-bold text-primary">404</div>
      <h1 class="text-2xl font-semibold">Página no encontrada</h1>
      <p class="text-gray-600">La página que buscás no existe o fue movida.</p>
      <Button label="Volver al inicio" variant="primary" @click="router.get('/')" />
    </div>
  </MainLayout>
</template>
