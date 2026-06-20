<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import { Button } from '~/components/ui'
import { router } from '@inertiajs/vue3'

defineProps<{ error: any }>()
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div class="flex flex-col items-center gap-4 py-24 text-center">
      <div class="text-6xl font-bold text-primary">500</div>
      <h1 class="text-2xl font-semibold">Ocurrió un error</h1>
      <p class="text-gray-600">{{ error?.message || 'Algo salió mal. Por favor, intentá de nuevo.' }}</p>
      <Button label="Volver al inicio" variant="primary" @click="router.get('/')" />
    </div>
  </MainLayout>
</template>
