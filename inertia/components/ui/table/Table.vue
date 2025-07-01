<script setup lang="ts">
import type { Meta } from '~/types/metadata';
import { Paginator } from '~/components/ui';

export type Column = {
  label: string
  key: string
  align?: 'left' | 'right' | 'center',
}

defineProps<{ columns: Column[]; data: any[]; metadata?: Meta }>()
defineEmits<{ (e: 'pageChange', page: number): void; (e: 'rowClick', row: any): void }>()
</script>

<template>
  <div class=" overflow-hidden rounded-md border">
  <table class="w-full bg-white">
    <thead class="border-b-2">
      <tr>
        <th v-for="(col, key) of columns" :key="key" class="px-4 py-2" :class="`text-${col.align || 'left'}`">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody v-if="data.length">
      <tr v-for="(row, key) of data" :key="key" class="border-b cursor-pointer hover:bg-gray-100" @click="$emit('rowClick', row)">
        <td v-for="(col, key) of columns" :key="key" class="px-4 py-2" :class="`text-${col.align || 'left'}`">{{ row[col.key] }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="p-2 text-gray-500" colspan="5">No se encontraron resultados.</td>
      </tr>
    </tbody>
    <tfoot v-if="metadata && metadata.lastPage > 1">
        <tr>
          <td colspan="5" class="p-2">
            <Paginator
              v-model="metadata.currentPage"
              :last-page="metadata.lastPage"
              @change="$emit('pageChange', $event)"
            />
          </td>
        </tr>
      </tfoot>
  </table>
</div>
</template>
