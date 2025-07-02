<script setup lang="ts">
import { computed, InputTypeHTMLAttribute, onMounted, useAttrs } from 'vue'
import { Toggle } from '~/components/ui'

const { type } = useAttrs() as { type: InputTypeHTMLAttribute }

const { size = 'md', ...props } = defineProps<{
  name?: string
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string | string[]
  autofocus?: boolean
  debounce?: number
  clearable?: boolean
  alignment?: 'left' | 'center' | 'right',
  size?: 'sm' | 'md' | 'lg'
}>()

const model = defineModel<string | number | boolean>({ default: ''})

let timeout: string | number | NodeJS.Timeout | undefined

const debouncedModel = computed({
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

const inputId = `input__${Math.random().toString(36).substring(2)}`

const align = `text-${props.alignment || 'left'}`

onMounted(() => {
  if (props.autofocus) {
      const input = document.querySelector(`#${inputId}`) as HTMLInputElement
      input?.focus()
  }
})
</script>

<template>
  <div class="relative" :class="{ 'flex items-center gap-2': type === 'boolean' }">
    <Toggle :size v-if="type === 'boolean'" v-model="model as boolean" @update:model-value="model = $event" />

    <div v-if="label" class="py-1 font-medium text-gray-700 text-sm"  id="input__label">{{ label }}</div>
    <input
      :id="inputId"
      v-if="type !== 'boolean' && type !== 'textarea'"
      :class="[{ 'border-red-500 border-2': error, '!text-gray-500': disabled }, align]"
      :name
      class="border rounded w-full py-2 px-4 outline-primary text-gray-700"
      :disabled
      :type
      :placeholder="placeholder"
      v-model="debouncedModel"
    />

    <div v-if="clearable && String(model).length && type !== 'textarea'" class="absolute top-[60%] right-0 -translate-x-1/2 -translate-y-1/2">
      <button type="button" @click="model = ''" class="text-gray-500 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <textarea
      :id="inputId"
      v-if="type === 'textarea'"
      :class="{ 'border-red-500 border-2': error }"
      class="border rounded w-full py-2 px-4 outline-primary text-black"
      :disabled
      :placeholder="placeholder"
      v-model="debouncedModel as string"
    />

    <div id="input__error" v-if="error" class="text-red-500">{{ concatErrors(error) }}</div>
  </div>
</template>
