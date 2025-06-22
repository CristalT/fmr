<script setup lang="ts">
import { computed, InputTypeHTMLAttribute, onMounted, useAttrs } from 'vue'

const { type } = useAttrs() as { type: InputTypeHTMLAttribute }

const props = defineProps<{
  name?: string
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string | string[]
  autofocus?: boolean
  debounce?: number
}>()

const model = defineModel()

let timeout: string | number | NodeJS.Timeout | undefined

const _model = computed({
  get: () => model.value,
  set: (value) => {
    if (props.debounce) {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        model.value = value
      }, props.debounce)
    } else {
      model.value = value
    }
  },
})

function concatErrors(error: string[] | string): string {
  if (Array.isArray(error) && error.length > 1) {
    return `${error.join('. ')}.`
  }
  return `${error}.`
}

onMounted(() => {

  if (props.autofocus) {
    const input = document.querySelector('input') ?? document.querySelector('textarea')
    input?.focus()
  }

})
</script>

<template>
  <div>
    <div v-if="label" class="py-1 font-medium text-gray-700 text-sm" id="input__label">{{ label }}</div>
    <input

      v-if="type !== 'textarea'"
      :class="{ 'border-red-500 border-2': error }"
      :name
      class="border rounded w-full py-2 px-4 outline-primary text-black"
      :disabled
      :type
      :placeholder="placeholder"
      v-model="_model"
    />

    <textarea
      v-else
      :class="{ 'border-red-500 border-2': error }"
      class="border rounded w-full py-2 px-4 outline-primary text-black"
      :disabled
      :placeholder="placeholder"
      v-model="_model as string"
    />
    <div id="input__error" v-if="error" class="text-red-500">{{ concatErrors(error) }}</div>
  </div>
</template>
