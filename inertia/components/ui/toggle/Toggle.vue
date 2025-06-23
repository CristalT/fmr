<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean | 0 | 1 | undefined
  disabled?: boolean
  label?: string
  class?: string
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
  }
})
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer select-none" :class="props.class">
    <span
      class="relative inline-block w-11 h-6 transition"
      :class="{ 'opacity-50 pointer-events-none': props.disabled }"
    >
      <input
        type="checkbox"
        class="sr-only"
        :checked="checked"
        :disabled="props.disabled"
        @change="checked = !checked"
      />
      <span
        class="block w-11 h-6 rounded-full transition bg-gray-300"
        :class="{ 'bg-primary-500': checked }"
      ></span>
      <span
        class="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition"
        :class="{ 'translate-x-5': checked }"
      ></span>
    </span>
    <span v-if="props.label" class="ml-2 text-gray-700">{{ props.label }}</span>
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
