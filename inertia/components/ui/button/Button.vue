<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string | number
    type?: 'button' | 'submit' | 'reset'
    full?: boolean
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
    size?: 'sm' | 'md'
    bordered?: boolean
    disabled?: boolean
    badge?: string | number
    flat?: boolean
  }>(),
  { type: 'button', full: false, variant: 'primary', bordered: false, size: 'md' }
)

const variants = () => {
  if (props.flat) {
    return {
      'text-primary hover:bg-primary/[0.1]': props.variant === 'primary',
      'text-secondary  hover:bg-secondary/[0.1]': props.variant === 'secondary',
      'text-red-600 hover:bg-red-700/[0.1]': props.variant === 'danger',
    }
  }
  return {
    'bg-primary text-white hover:bg-primary/[0.9]': props.variant === 'primary',
    'bg-secondary text-white hover:bg-secondary/[0.9]': props.variant === 'secondary',
    'bg-transparent text-gray-600 hover:bg-transparent/[0.1]': props.variant === 'tertiary',
    'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger',
  }
}

function onClick() {
  if (props.disabled) return
}
</script>

<template>
  <button @click="onClick" :disabled="disabled" :type="type" :class="{
    'w-full': full,
    ...variants(),
    'border': bordered,
    'border-gray-300': bordered,
    'opacity-80': disabled,
    'cursor-not-allowed': disabled,
    'py-2 px-4': props.size === 'md',
    'py-0.5 px-2': props.size === 'sm',

  }" class="rounded transition-all">

    <div class="flex items-center gap-2 justify-center">
      <slot name="icon" />
      {{ label }}
      <span class="text-xs bg-gray-500 text-white rounded-full px-2 py-[2px]" v-if="badge">
        {{ badge }}
      </span>
    </div>
  </button>
</template>
