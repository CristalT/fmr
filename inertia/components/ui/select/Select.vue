<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect, defineAsyncComponent } from 'vue'


const asyncComponents = {
 StatusBadge: defineAsyncComponent(() => import('~/components/StatusBadge.vue')),
}

const currentComponent = (name: keyof typeof asyncComponents) => {
  return asyncComponents[name]
}

const emit = defineEmits<{ (e: 'change', option: { value: string | number, label: string }): void }>()

const props = defineProps<{
  options: Array<{ value: string | number, label: string, component?: { name: string, props: Record<string, unknown> } }>
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string | string[]
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
}>()


const model = defineModel()

const isOpen = ref(false)
const searchQuery = ref('')
const selectedOption = ref<{ value: string | number, label: string } | null>(null)
const highlightedIndex = ref(-1)
const searchInput = ref<HTMLInputElement | null>(null)

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query)
  )
})

// Updates the selected option when the model changes
watch(model, (value) => {
  selectedOption.value = props.options.find(option => option.value === value) || null
}, { immediate: true })

// Resets the highlighted index when filtered options change
watch(filteredOptions, () => {
  highlightedIndex.value = -1
})


// Reset values and focus input when dropdown is opened
watchEffect(() => {
  if (isOpen.value) {
    searchQuery.value = ''
    highlightedIndex.value = -1
    searchInput.value?.focus()
  }
})

function selectOption(option: { value: string | number, label: string }) {
  model.value = option.value
  selectedOption.value = option
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
  emit('change', option)
}

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value

    if (!isOpen.value) {
      // Clean the search on close
      searchQuery.value = ''
      highlightedIndex.value = -1
    }
  }
}

function closeDropdown() {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
}

function concatErrors(error: string[] | string): string {
  if (Array.isArray(error) && error.length > 1) {
    return `${error.join('. ')}.`
  }
  return `${error}.`
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      toggleDropdown()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (highlightedIndex.value < filteredOptions.value.length - 1) {
        highlightedIndex.value++
        scrollOptionIntoView('down')
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
        scrollOptionIntoView('up')
      }
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      closeDropdown()
      break
  }
}

// Ensures the highlighted option is visible in the scroll area
function scrollOptionIntoView(direction: 'up' | 'down') {
  const container = document.querySelector('.options-container')
  const highlighted = document.querySelector('.option-item.highlighted')

  if (!container || !highlighted) return

  const containerRect = container.getBoundingClientRect()
  const highlightedRect = highlighted.getBoundingClientRect()

  if (highlightedRect.bottom + highlightedRect.height > containerRect.bottom && direction === 'down') {
    container.scrollTop += highlightedRect.bottom - containerRect.bottom + highlightedRect.height
  } else if (highlightedRect.top <= containerRect.top && direction === 'up') {
    container.scrollTop -= containerRect.top - highlightedRect.top + highlightedRect.height
  }
}

// Closes the dropdown when clicking outside the component
function onClickOutside(event: MouseEvent) {
  const element = event.target as HTMLElement
  if (!element.closest('.searchable-select-container')) {
    closeDropdown()
  }
}

// Adds and removes listeners on mount and unmount
onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="searchable-select-container relative">
    <div v-if="label" class="py-1 font-medium text-gray-700 text-sm">{{ label }}</div>

    <!-- Select visible -->
    <div @click="toggleDropdown" @keydown="handleKeydown" :class="{
      'border-red-500 border-2': error,
      'bg-gray-100': disabled,
      'border-primary': isOpen && !error
    }"
      class="border rounded w-full py-2 px-4 flex justify-between items-center cursor-pointer outline-none text-black"
      :tabindex="disabled ? -1 : 0">
      <div v-if="selectedOption" class="text-black">
        {{ selectedOption.label }}
      </div>
      <div v-else class="text-gray-400">
        {{ placeholder || 'Seleccione una opción' }}
      </div>
      <div class="pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
          :class="{ 'transform rotate-180': isOpen }" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
      <!-- Search input -->
      <div class="sticky top-0 bg-white p-2 border-b" v-if="props.searchable">
        <input ref="searchInput" v-model="searchQuery" type="text"
          class="border rounded w-full py-1 px-3 outline-primary text-black"
          :placeholder="searchPlaceholder || 'Buscar...'" @click.stop @keydown.stop="handleKeydown" />
      </div>

      <!-- Options list -->
      <div v-if="filteredOptions.length > 0" class="options-container max-h-60 overflow-auto">
        <div v-for="(option, index) in filteredOptions" :key="option.value" @click.stop="selectOption(option)"
          @mouseover="highlightedIndex = index" class="option-item px-4 py-2 hover:bg-gray-100 cursor-pointer" :class="{
            'bg-gray-100': selectedOption && selectedOption.value === option.value,
            'highlighted bg-blue-100': highlightedIndex === index
          }">

          <component v-if="option.component" :is="currentComponent(option.component.name)" v-bind="option.component.props"  />
          <span v-else>
            {{ option.label }}
          </span>
        </div>
      </div>

      <!-- No results message -->
      <div v-else class="px-4 py-2 text-gray-500">
        {{ noResultsText || 'No se encontraron resultados' }}
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-red-500 mt-1">{{ concatErrors(error) }}</div>
  </div>
</template>
