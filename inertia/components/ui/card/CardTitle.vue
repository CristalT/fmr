<script setup lang="ts">
import { Icon } from '~/components/ui'
defineProps<{
  title: string
  collapsible: boolean
  isCollapsed: boolean
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-bold">{{ title }}</h2>
    <div v-if="collapsible" class="ml-4">
      <Icon
        name="chevronUp"
        class="h-5 w-5 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isCollapsed }" />
    </div>
  </div>
</template>
