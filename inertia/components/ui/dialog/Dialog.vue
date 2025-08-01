<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const model = defineModel<boolean>()

onMounted(() => {
  document.addEventListener('keyup', close)
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', close)
})

function close(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    model.value = false
  }
}
</script>
<template>
  <teleport to="body">
    <div
      v-if="model"
      class="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-black/[0.8]">
      <slot></slot>
    </div>
  </teleport>
</template>
