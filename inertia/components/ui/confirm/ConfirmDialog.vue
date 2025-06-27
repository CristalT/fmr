<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '~/components/ui'

type Props = {
  title?: string;
  type?: 'danger' | 'warning' | 'info' | 'success'
  message?: string;
  confirm?: string;
  cancel?: string;
};

const { confirm = 'Aceptar', cancel = 'Cancelar', type = 'primary' } = defineProps<Props>();


const emits = defineEmits(['confirm', 'cancel'])

const variant = computed(() => {
  switch (type) {
    case 'danger':
      return 'danger'
    default:
      return 'primary'
  }
})

</script>

<template>
  <div  class="w-screen h-screen fixed top-0 left-0 bg-black/[0.8] flex items-center justify-center z-10">
    <div class="bg-white rounded-md w-[500px]">
    <div class="text-lg font-semibold border-b p-4" :class="{ 'text-red-600': type === 'danger' }">
      {{ title }}
    </div>
    <div class="p-4 text-gray-600">
      {{ message }}
    </div>
    <div class="justify-end gap-2 flex p-4">
      <Button @click="emits('cancel')" :label="cancel" variant="tertiary" />
      <Button @click="emits('confirm')" :label="confirm" :variant />
    </div>
  </div>
  </div>
</template>
