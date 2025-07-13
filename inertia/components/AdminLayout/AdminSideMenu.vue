<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { Icon } from '~/components/ui'
import { usePage } from '@inertiajs/vue3'
import { MenuItem } from './menu_builder'


defineProps<{ options: MenuItem[] }>()

const isCollapsed = useLocalStorage('isCollapsed', false)

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

function isActive(item: MenuItem) {
  if (item.section && usePage().url.includes(item.section)) {
    return 'bg-gray-800'
  }
} 
</script>

<template>
  <aside class="h-screen bg-slate-900 transition-all duration-300 relative flex flex-col"
    :class="{ 'min-w-[15rem]': !isCollapsed, 'min-w-[4rem]': isCollapsed }">

    <ul class="w-full">
      <li v-for="(item, key) of options" :key="key" :class="[isActive(item), { 'justify-center': isCollapsed }]"
        class="p-4 gap-4 cursor-pointer text-gray-300 font-bold hover:bg-gray-800 flex items-center transition-all"
        @click="item.action">
        <Icon v-if="item.icon" :name="item.icon" />
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </li>
    </ul>

    <div role="button" @click="toggleMenu"
      class="absolute -right-3 bottom-4 bg-slate-900 text-white p-1 rounded-full shadow-md hover:bg-slate-800 z-10 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'rotate-180': isCollapsed }" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  </aside>
</template>
