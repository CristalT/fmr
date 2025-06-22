<script lang="ts" setup>
import { computed } from 'vue'
import { randId } from '~/shared/utils'

const props = withDefaults(
  defineProps<{
    label: string
    valueType: 'num' | 'bool'
  }>(),
  { valueType: 'bool' }
)

const model = defineModel<boolean | number>()

const randomId = randId()

const toBool = computed({
  get() {
    return Boolean(model.value)
  },
  set(value) {
    if (props.valueType === 'num') {
      model.value = Boolean(value) ? 1 : 0
    } else {
      model.value = Boolean(value)
    }
  },
})
</script>
<template>
  <div class="flex gap-2 cursor-pinter">
    <input type="checkbox" :id="randomId" v-model="toBool" />
    <label :for="randomId">{{ label }}</label>
  </div>
</template>
