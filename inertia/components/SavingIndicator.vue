<script setup lang="ts">
import { Icon } from '~/components/ui'

const { isSaving, isSaved, isError } = defineProps<{ isSaving: boolean | undefined, isSaved: boolean, isError?: boolean }>()
</script>
<template>
  <div class="pl-2 text-gray-600">
    <span v-if="isSaving">Guardando ...</span>
    <span v-if="isSaved && !isError && !isSaving" class="flex gap-2">
      <Icon name="check" class="text-green-500" />
      Guardado
    </span>
    <span v-if="isError && !isSaved && !isSaving" class="flex gap-2">
      <Icon name="exclamation" class="text-red-500" />
      Error al guardar
    </span>
  </div>
</template>
