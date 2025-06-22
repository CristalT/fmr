<script lang="ts" setup>
defineProps<{
  options: string[]
}>()

const model = defineModel<string>()
</script>
<template>
  <select class="border rounded w-full p-2 outline-primary h-full" v-model="model">
    <option v-for="(item, index) of options" :key="index">{{ item }}</option>
  </select>
</template>
