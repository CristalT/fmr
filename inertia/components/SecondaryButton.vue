<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
    full?: boolean
  }>(),
  { type: 'button', full: false }
)
</script>

<template>
  <button :type="type" :class="{ 'w-full': full }" class="bg-black text-white p-2">
    {{ label }}
  </button>
</template>
