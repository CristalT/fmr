<script setup lang="ts">
import { Input } from '~/components/ui'

const { debounce = 800, flat = false } = defineProps<{
  autofocus?: boolean
  placeholder?: string
  debounce?: number
  flat?: boolean
}>()

const terms = defineModel('terms', {
  type: String,
  default: '',
})

const page = defineModel('page', {
  type: Number,
  default: 1,
})
</script>
<template>
  <div :class="{ 'rounded bg-white p-2 shadow-sm': !flat }">
    <Input
      :autofocus
      label="Buscar"
      :placeholder="placeholder || `Buscar ...`"
      v-model="terms"
      :debounce
      clearable
      @update:model-value="page = 1" />
  </div>
</template>
