<script setup lang="ts">
import { computed } from 'vue';
import { icons } from './icons'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const { size = 'md', name } = defineProps<{ size?: Size, name: keyof typeof icons }>()

const sizeMap: Record<Size, string> = {
  xs: '12',
  sm: '16',
  md: '24',
  lg: '32',
  xl: '48',
}

const computedSize = computed(() => sizeMap[size])


</script>
<template>
  <component :is="icons[name]" :size="computedSize" />
</template>
