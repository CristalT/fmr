<script setup lang="ts">
import { Button, Dialog } from '~/components/ui'

type Props = {
  title?: string;
  message?: string;
  confirm?: string;
  cancel?: string;
};

const { confirm = 'Aceptar', cancel = 'Cancelar' } = defineProps<Props>();


const emits = defineEmits(['confirm', 'cancel'])

</script>

<template>
  <div  class="w-screen h-screen fixed top-0 left-0 bg-black/[0.8] flex items-center justify-center z-10">
    <div class="bg-white p-4 rounded-md w-[500px]">
    <div class="text-lg font-semibold">
      {{ title }}
    </div>
    <div class="py-4">
      {{ message }}
    </div>
    <div class="justify-end gap-2 flex">
      <Button @click="emits('cancel')" :label="cancel" variant="tertiary" />
      <Button @click="emits('confirm')" :label="confirm" />
    </div>
  </div>
  </div>
</template>
