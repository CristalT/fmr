<script setup lang="ts">
import { computed } from 'vue'

const { size = 'md', ...props } = defineProps<{
  modelValue: boolean | 0 | 1 | undefined
  disabled?: boolean
  label?: string
  class?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const checked = computed({
  get: () => Boolean(props.modelValue),
  set: (val: boolean) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const sizes = {
  sm: 'w-10 h-5',
  md: 'w-11 h-6',
  lg: 'w-12 h-7',
}

const dotSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}
</script>

<template>
  <label class="flex cursor-pointer select-none items-center gap-2" :class="props.class">
    <span
      class="relative inline-block transition"
      :class="[{ 'pointer-events-none opacity-50': props.disabled }, sizes[size]]">
      <input
        type="checkbox"
        class="sr-only"
        :checked="checked"
        :disabled="props.disabled"
        @change="checked = !checked" />
      <span
        class="block rounded-full bg-gray-300 transition"
        :class="[{ 'bg-primary-500': checked }, sizes[size]]"></span>
      <span
        class="dot absolute left-1 top-1 rounded-full bg-white shadow transition"
        :class="[{ 'translate-x-5': checked }, dotSizes[size]]"></span>
    </span>
    <span v-if="props.label" class="ml-2" :class="`text-${size}`">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.dot {
  transition: transform 0.2s;
}
.translate-x-5 {
  transform: translateX(20px);
}
.bg-primary-500 {
  background-color: #2563eb !important; /* Example Tailwind primary color, adjust as needed */
}
</style>
