<script setup lang="ts">
import AdminSideMenu from './AdminSideMenu.vue';
import Toast from '../Toast.vue'
import LoadingOverlay from '../LoadingOverlay.vue'

import { useConfirm } from '~/composables'

import { router } from '@inertiajs/vue3'
import menu from './menu';

const { confirmation } = useConfirm()

const { loading = false } = defineProps<{ loading?: boolean }>()

const slots = defineSlots()

const options = menu.addOption({ label: 'Salir', action: logout, icon: 'power' }).getItems()

async function logout() {
  const conf = await confirmation({
    title: 'Salir',
    message: '¿Desea cerrar sesión?',
    type: 'danger'
  })


  if (conf) {
    router.visit('/auth/logout')
  }
}
</script>

<template>
  <Toast />
  <main class="bg-gray-200 h-screen flex">
    <AdminSideMenu :options />
    <article class="flex-grow overflow-y-auto relative">
      <header v-if="$slots.topbar" class="sticky top-0 z-20 items-center bg-white shadow-sm p-2">
        <slot name="topbar"></slot>
      </header>

      <LoadingOverlay :loading="loading" />

      <div class="p-2 h-full">
        <slot name="default"></slot>
      </div>

      <div class="h-[300px]"></div>
      <footer v-if="$slots.footer" class="border-t box-border w-full p-2 bg-white sticky bottom-0">
        <slot name="footer"></slot>
      </footer>
    </article>
  </main>
</template>
