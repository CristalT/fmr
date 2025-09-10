<script setup lang="ts">
import MenuOption from './MenuOption.vue'

import { useLocalStorage } from '@vueuse/core'

import type { MenuOptions } from './menu_builder'

const { options } = defineProps<{ options: MenuOptions[] }>()

const isCollapsed = useLocalStorage('isCollapsed', false)

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

function doAction(option: MenuOptions) {
  options
    .flatMap((opt) => [opt, ...(opt.subOptions ?? [])])
    .forEach((opt) => {
      opt.isActive = false
    })

  option.action?.()

  option.isActive = true // Set the clicked item as active
}

// @ts-ignore
const version = APP_VERSION
</script>

<template>
  <aside
    class="relative flex h-screen flex-col border-r bg-slate-900 transition-all duration-300"
    :class="{ 'min-w-[15rem]': !isCollapsed, 'min-w-[4rem]': isCollapsed }">
    <div class="h-full overflow-y-auto p-2">
      <MenuOption
        v-for="option in options"
        :option="option"
        :is-aside-collapsed="isCollapsed"
        :key="option.label"
        @click="doAction" />

      <div
        role="button"
        @click="toggleMenu"
        class="absolute -right-3 bottom-4 z-10 rounded-full border bg-white p-1 transition-all hover:bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          :class="{ 'rotate-180': isCollapsed }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </div>
    <div
      class="flex h-16 items-center justify-center text-center text-xs text-gray-50"
      v-show="!isCollapsed">
      Castor v{{ version }}
    </div>
  </aside>
</template>
