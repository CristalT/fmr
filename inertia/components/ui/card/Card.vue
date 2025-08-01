<script setup lang="ts">
import { ref } from 'vue'
import CardTitle from './CardTitle.vue'

interface Props {
  title?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const { title = '', collapsible = false, defaultCollapsed = false } = defineProps<Props>()

const isCollapsed = ref(defaultCollapsed)

function toggleCollapse() {
  if (collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <main class="relative rounded-md border bg-white shadow-sm">
    <header
      v-if="title || $slots.header"
      class="border-b px-4 py-4"
      :class="{ 'cursor-pointer transition-colors hover:bg-gray-50': collapsible }"
      @click="toggleCollapse">
      <CardTitle :title="title" :collapsible :is-collapsed v-if="!$slots.header" />
      <slot name="header" v-else></slot>
    </header>

    <div
      class="transition-all duration-300 ease-in-out"
      :class="{
        'overflow-hidden': collapsible,
        'max-h-0 opacity-0': collapsible && isCollapsed,
        'max-h-none opacity-100': !collapsible || !isCollapsed,
      }">
      <article class="p-4">
        <slot></slot>
      </article>
      <footer
        class="absolute bottom-0 left-0 right-0 border-t bg-white px-4 pb-4 pt-0"
        v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </main>
</template>
