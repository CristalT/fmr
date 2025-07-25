<script setup lang="ts">

import type { Meta } from '~/types/metadata';
import { Paginator } from '~/components/ui';
import { computed } from 'vue';

export type Column = {
  label: string
  key: string
  align?: 'left' | 'right' | 'center',
}

const slots = defineSlots()

const { columns } = defineProps<{ columns: Column[]; data: any[]; metadata?: Meta; selectedRows?: string[] }>()
defineEmits<{ (e: 'pageChange', page: number): void; (e: 'rowClick', row: any): void }>()

const footerColspan = computed(() => {
  let colspan = columns.length

  if (slots.prepend) colspan += 1
  if (slots.append) colspan += 1

  return colspan
})
</script>

<template>
  <div class=" overflow-hidden rounded-md border">
  <table class="w-full bg-white">
    <thead class="border-b-2">
      <tr>
        <th v-if="$slots.prepend" class="px-4 py-2">
        </th>
        <th v-for="(col, key) of columns" :key="key" class="px-4 py-2" :class="`text-${col.align || 'left'}`">{{ col.label }}</th>
        <th v-if="$slots.append" class="px-4 py-2">
        </th>
      </tr>
    </thead>
    <tbody v-if="data.length">
      <tr v-for="(row, key) of data" :key="key" class="border-b cursor-pointer hover:bg-gray-100" :class="selectedRows?.includes(row.id) ? '!bg-green-100' : ''" @click="$emit('rowClick', row)">
        <td v-if="$slots.prepend">
          <slot name="prepend" :row="row" />
        </td>
        <td v-for="(col, key) of columns" :key="key" class="px-4 py-2" :class="`text-${col.align || 'left'}`">
          <span>{{ row[col.key] }}</span>
        </td>
        <td v-if="$slots.append">
          <slot name="append" :row="row" />
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="p-2 text-gray-500" :colspan="columns.length">No se encontraron resultados.</td>
      </tr>
    </tbody>
    <tfoot v-if="metadata && metadata.lastPage > 1">
        <tr>
          <td :colspan="footerColspan" class="p-2">
            <Paginator
              :modelValue="metadata.currentPage"
              :last-page="metadata.lastPage"
              @change="$emit('pageChange', $event)"
            />
          </td>
        </tr>
      </tfoot>
  </table>
</div>
</template>
