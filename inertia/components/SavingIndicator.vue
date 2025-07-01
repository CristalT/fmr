<script setup lang="ts">
import { Icon } from '~/components/ui'

const { isSaving, isSaved, isError, float } = defineProps<{ isSaving: boolean | undefined, isSaved: boolean, isError?: boolean, float?: boolean }>()


</script>
<template>
  <div class="pl-2 text-gray-600">
    <span v-if="isSaving" :class="{ 'fixed bottom-6 right-6 bg-white border rounded-full py-2 px-4 shadow-md': float }">Guardando ...</span>
    <span v-if="isSaved && !isError && !isSaving" class="flex gap-2" :class="{ 'fixed bottom-6 right-6 bg-white border rounded-full py-2 px-4 shadow-md': float }">
      <Icon name="check" class="text-green-500"  />
      Guardado
    </span>
    <span v-if="isError && !isSaved && !isSaving" class="flex gap-2" :class="{ 'fixed bottom-6 right-6 bg-white border rounded-full py-2 px-4 shadow-md': float }">
      <Icon name="exclamation" class="text-red-500" />
      Error al guardar
    </span>
  </div>
</template>
