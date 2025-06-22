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
      class="w-screen h-screen fixed top-0 left-0 bg-black/[0.8] flex items-center justify-center"
    >
      <slot></slot>
    </div>
  </teleport>
</template>
