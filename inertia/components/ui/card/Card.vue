<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '~/components/ui'

interface Props {
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const { collapsible = false, defaultCollapsed = false } = defineProps<Props>()

const isCollapsed = ref(defaultCollapsed)

function toggleCollapse() {
  if (collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <main class="bg-white rounded-md shadow-sm border">
    <header
      class="p-4 border-b"
      v-if="$slots.header"
      :class="{ 'cursor-pointer hover:bg-gray-50 transition-colors': collapsible }"
      @click="toggleCollapse"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <slot name="header"></slot>
        </div>
        <div v-if="collapsible" class="ml-4">
          <Icon name="chevronUp" class="w-5 h-5 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isCollapsed }" />
        </div>
      </div>
    </header>

    <div
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :class="{ 'max-h-0 opacity-0': collapsible && isCollapsed, 'max-h-none opacity-100': !collapsible || !isCollapsed }"
    >
      <article class="p-4">
        <slot></slot>
      </article>
      <footer class="p-4" v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </main>
</template>
