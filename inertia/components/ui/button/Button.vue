<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string | number
    type?: 'button' | 'submit' | 'reset'
    full?: boolean
    variant?: 'primary' | 'secondary' | 'tertiary'
    size?: 'sm' | 'md'
    bordered?: boolean
    disabled?: boolean
  }>(),
  { type: 'button', full: false, variant: 'primary', bordered: false, size: 'md' }
)

const emit = defineEmits<{}>()

const variants = {
  'bg-primary text-white hover:bg-primary/[0.9]': props.variant === 'primary',
  'bg-secondary text-white hover:bg-secondary/[0.9]': props.variant === 'secondary',
  'bg-gray-100 text-black hover:bg-gray-200': props.variant === 'tertiary',
}

function onClick() {
  if (props.disabled) return
}
</script>

<template>
  <button
    @click="onClick"
    :disabled="disabled"
    :type="type"
    :class="{
      'w-full': full,
      ...variants,
      'border': bordered,
      'border-gray-300': bordered,
      'opacity-80': disabled,
      'cursor-not-allowed': disabled,
      'py-2 px-4': props.size === 'md',
      'py-0.5 px-2': props.size === 'sm',
    }"
    class="bg-zin rounded"
  >

    <div class="flex items-center gap-2 justify-center">
      <slot name="icon" />
      {{ label }}
    </div>
  </button>
</template>
