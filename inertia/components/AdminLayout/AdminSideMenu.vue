<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { Icon } from '~/components/ui'
import { usePage } from '@inertiajs/vue3'
import type { MenuOptions } from './menu_builder'
import { ref } from 'vue'

const { options } = defineProps<{ options: MenuOptions[] }>()

const isCollapsed = useLocalStorage('isCollapsed', false)

const menuOptions = ref(
  options.map((option) => ({
    ...option,
    isCollapsed: true,
  }))
)

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

function isActive(item: MenuOptions) {
  if (item.section && usePage().url.includes(item.section)) {
    return 'bg-gray-800'
  }
}

function isActiveSubOption(item: MenuOptions) {
  if (item.subOptions) {
    return item.subOptions.some((subItem) => usePage().url.includes(subItem.section || ''))
  }
  return false
}

function doAction(item: MenuOptions & { isCollapsed?: boolean }) {
  if (item.action) {
    item.action()
  } else if (item.subOptions) {
    item.isCollapsed = !item.isCollapsed
  }
}

// @ts-ignore
const version = APP_VERSION
</script>

<template>
  <aside
    class="relative flex h-screen flex-col bg-slate-900 transition-all duration-300"
    :class="{ 'min-w-[15rem]': !isCollapsed, 'min-w-[4rem]': isCollapsed }">
    <div class="h-full overflow-y-auto">
      <ul class="w-full">
        <li
          v-for="(item, key) of menuOptions"
          :key="key"
          :class="[
            isActive(item),
            { 'justify-center': isCollapsed },
            { 'bg-slate-700': !item.isCollapsed },
          ]"
          class="cursor-pointer text-gray-300 transition-all hover:bg-gray-800"
          @click="doAction(item)">
          <div class="flex items-center gap-4 p-4 font-bold">
            <Icon v-if="item.icon" :name="item.icon" />
            <span v-if="!isCollapsed">{{ item.label }}</span>
          </div>

          <ul
            v-if="item.subOptions && (!item.isCollapsed || isActiveSubOption(item))"
            class="bg-slate-800">
            <li
              v-for="(subItem, subKey) of item.subOptions"
              :key="subKey"
              class="flex cursor-pointer items-center gap-2 py-2 pl-14 text-gray-300 hover:bg-gray-700"
              @click.stop="subItem.action">
              <Icon v-if="subItem.icon" :name="subItem.icon" />
              <span>{{ subItem.label }}</span>
            </li>
          </ul>
        </li>
      </ul>

      <div
        role="button"
        @click="toggleMenu"
        class="absolute -right-3 bottom-4 z-10 rounded-full bg-slate-900 p-1 text-white shadow-md transition-all hover:bg-slate-800">
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
      class="flex h-16 items-center justify-center text-center text-xs text-gray-500"
      v-show="!isCollapsed">
      Castor v{{ version }}
    </div>
  </aside>
</template>
