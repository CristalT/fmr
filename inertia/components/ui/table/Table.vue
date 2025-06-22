<script setup lang="ts">
export type Column = {
  label: string
  key: string
  align?: 'left' | 'right' | 'center'
}

defineProps<{ columns: Column[]; data: any[] }>()
</script>

<template>
  <table class="w-full bg-white shadow-sm rounded-md">
    <thead class="border-b">
      <tr>
        <th v-for="(col, key) of columns" :key="key" class="p-2" :class="`text-${col.align || 'left'}`">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, key) of data" :key="key" class="border-b">
        <td v-for="(col, key) of columns" :key="key" class="p-2" :class="`text-${col.align || 'left'}`">{{ row[col.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>
