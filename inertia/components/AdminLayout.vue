<script setup lang="ts">
import AdminSideMenu from '~/components/AdminSideMenu.vue'
import Toast from './Toast.vue'
import LoadingOverlay from './LoadingOverlay.vue'

const { loading = false } = defineProps<{ loading?: boolean }>()
const slots = defineSlots()
</script>

<template>
  <Toast />
  <main class="bg-gray-200 h-screen flex">
    <AdminSideMenu />
    <article class="flex-grow overflow-y-auto relative">
      <header v-if="$slots.topbar" class="sticky top-0 flex justify-end items-center bg-white shadow-sm p-2">
        <slot name="topbar"></slot>
      </header>

      <LoadingOverlay :loading="loading" />

      <div class="p-2 h-full">
        <slot name="default"></slot>
      </div>

      <footer v-if="$slots.footer" class="border-t box-border w-full p-2 bg-white sticky bottom-0">
        <slot name="footer"></slot>
      </footer>
    </article>
  </main>
</template>
