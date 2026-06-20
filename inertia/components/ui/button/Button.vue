<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string | number
    type?: 'button' | 'submit' | 'reset'
    full?: boolean
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success'
    size?: 'sm' | 'md'
    bordered?: boolean
    disabled?: boolean
    badge?: string | number
    flat?: boolean
    stretch?: boolean
  }>(),
  { type: 'button', full: false, variant: 'primary', bordered: false, size: 'md' }
)

const variants = () => {
  if (props.flat) {
    return {
      'text-primary bg-primary/[0.1] hover:bg-primary/[0.2]': props.variant === 'primary',
      'text-secondary bg-secondary/[0.1] hover:bg-secondary/[0.2]': props.variant === 'secondary',
      'text-red-600 bg-red-700/[0.1] hover:bg-red-700/[0.2]': props.variant === 'danger',
      'text-green-600 bg-green-700/[0.1] hover:bg-green-700/[0.2]': props.variant === 'success',
    }
  }
  return {
    'bg-primary text-white hover:bg-primary/[0.9]': props.variant === 'primary',
    'bg-secondary text-white hover:bg-secondary/[0.9]': props.variant === 'secondary',
    'bg-gray-100 text-gray-600 hover:bg-gray-200': props.variant === 'tertiary',
    'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger',
    'bg-green-600 text-white hover:bg-green-700': props.variant === 'success',
  }
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
      ...variants(),
      'border': bordered,
      'border-gray-300': bordered,
      'opacity-80': disabled,
      'cursor-not-allowed': disabled,
      'px-4 py-2': size === 'md',
      'px-2 py-0.5': size === 'sm',
      'h-full w-full rounded-none': stretch,
    }"
    class="rounded transition-all">
    <div class="flex items-center justify-center gap-2">
      <slot name="icon" />
      {{ label }}
      <span class="rounded-full bg-gray-500 px-2 py-[2px] text-xs text-white" v-if="badge">
        {{ badge }}
      </span>
    </div>
  </button>
</template>
