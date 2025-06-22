<script lang="ts" setup>
defineProps<{ variant: 'danger' | 'warning' | 'info' }>()

const variantClasses = {
  danger: 'bg-red-600 text-white',
  warning: 'bg-yellow-300 text-yellow-900',
  info: 'bg-blue-200 text-blue-700',
}
</script>
<template>
  <div :class="variantClasses[variant]" class="p-4 rounded-md my-3"><slot></slot></div>
</template>
