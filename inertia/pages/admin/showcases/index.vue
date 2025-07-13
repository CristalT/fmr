<script setup lang="ts">
import Showcases from '~/components/Showcases.vue';
import { router } from '@inertiajs/vue3'
import { Button } from '~/components/ui'
import { AdminLayout } from '~/components'
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <div class="flex gap-2 justify-end">

        <Button label="Crear" @click="router.visit('/admin/showcases/create')" />
      </div>
    </template>

    <Showcases />
  </AdminLayout>
</template>
