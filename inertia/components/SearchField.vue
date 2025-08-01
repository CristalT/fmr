<script setup lang="ts">
import { Input } from '~/components/ui'

defineProps<{
  autofocus?: boolean
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
  <div class="rounded bg-white p-2 shadow-sm">
    <Input
      :autofocus
      placeholder="Buscar ..."
      v-model="terms"
      :debounce="800"
      clearable
      @update:model-value="page = 1" />
  </div>
</template>
