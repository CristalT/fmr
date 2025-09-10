<script setup lang="ts">
import { Icon } from '~/components/ui'
import { MenuOptions } from './menu_builder'
import { computed } from 'vue'
const { option } = defineProps<{ option: MenuOptions; isAsideCollapsed?: boolean }>()
const emit = defineEmits<{
  (e: 'click', option: MenuOptions): void
}>()

const isCollapsed = computed({
  get() {
    return option.isCollapsed?.value ?? true
  },
  set(value: boolean) {
    option.isCollapsed!.value = value
  },
})

const isActive = computed(() => option.isActive && !option.subOptions?.length)

function handleClick(option: MenuOptions) {
  isCollapsed.value = !isCollapsed.value
  emit('click', option)
}
</script>

<template>
  <div
    @click="handleClick(option)"
    class="relative my-1 flex cursor-pointer items-center gap-4 rounded-md py-2 pl-4 pr-2 transition-colors hover:bg-slate-800"
    :class="{ 'bg-slate-700': isActive }">
    <div class="is-active-indicator bg-slate-300" v-if="isActive"></div>
    <Icon v-if="option.icon" :name="option.icon" class="text-slate-300" />
    <span v-if="!isAsideCollapsed" class="text-slate-300">{{ option.label }}</span>
  </div>

  <div v-if="option.subOptions && !isCollapsed" class="pl-[40px]">
    <MenuOption
      v-for="subOption in option.subOptions"
      :key="subOption.label"
      :option="subOption"
      @click="emit('click', subOption)" />
  </div>
</template>

<style scoped>
.is-active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
</style>
