<script setup lang="ts">
import { useToast } from '~/composables'

const { toasts } = useToast()
</script>

<!-- Toast.vue -->
<template>
  <Teleport to="body">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'fixed bottom-16 right-4 z-50 flex flex-col gap-2 rounded-lg px-6 py-3 shadow-lg',
          {
            'bg-blue-800 text-white': toast.type === 'info',
            'bg-green-600 text-white': toast.type === 'success',
            'bg-yellow-800 text-white': toast.type === 'warn',
            'bg-red-700 text-white': toast.type === 'error',
          },
        ]"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>
