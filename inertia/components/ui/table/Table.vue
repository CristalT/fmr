<script setup lang="ts">
import type { Meta } from '~/types/metadata'
import { Paginator } from '~/components/ui'
import { computed, ref } from 'vue'

export type Column = {
  label: string
  key: string
  align?: 'left' | 'right' | 'center'
}

const slots = defineSlots()

const props = defineProps<{
  columns: Column[]
  title?: string
  data: any[]
  metadata?: Meta
  selectedRows?: string[]
  sortable?: boolean
}>()

const { columns, data, sortable = false } = props

const rows = computed(() => props.data)

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'rowClick', row: any): void
  (e: 'rowsReorder', newOrder: any[]): void
}>()

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const footerColspan = computed(() => {
  let colspan = columns.length

  if (slots.prepend) colspan += 1
  if (slots.append) colspan += 1
  if (sortable) colspan += 1 // Add column for drag handle

  return colspan
})

function onDragStart(event: DragEvent, index: number) {
  if (!sortable) return
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
}

function onDragOver(event: DragEvent, index: number) {
  if (!sortable || draggedIndex.value === null) return
  event.preventDefault()
  dragOverIndex.value = index
}

function onDragLeave() {
  if (!sortable) return
  dragOverIndex.value = null
}

function onDrop(event: DragEvent, dropIndex: number) {
  if (!sortable || draggedIndex.value === null) return
  event.preventDefault()

  const dragIndex = draggedIndex.value
  if (dragIndex === dropIndex) return

  // Create new array with reordered items
  const newData = [...data]
  const draggedItem = newData[dragIndex]

  // Remove dragged item
  newData.splice(dragIndex, 1)

  // Insert at new position
  newData.splice(dropIndex, 0, draggedItem)

  // Emit the new order
  emit('rowsReorder', newData)

  // Reset drag state
  draggedIndex.value = null
  dragOverIndex.value = null
}

function onDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div class="overflow-x-auto rounded-md border">
    <table class="w-full min-w-[480px] bg-white">
      <thead class="border-b-2">
        <tr>
          <th v-if="sortable" class="w-10 px-2 py-2"></th>
          <th v-if="$slots.prepend" class="px-4 py-2"></th>
          <th
            v-for="(col, key) of columns"
            :key="key"
            class="px-4 py-2"
            :class="`text-${col.align || 'left'}`">
            {{ col.label }}
          </th>
          <th v-if="$slots.append" class="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody v-if="rows?.length">
        <tr
          v-for="(row, index) of rows"
          :key="index"
          :draggable="sortable"
          class="border-b transition-colors"
          :class="{
            'cursor-pointer hover:bg-gray-100': !sortable,
            'cursor-move': sortable,
            'opacity-50': draggedIndex === index,
            'bg-blue-50': dragOverIndex === index && draggedIndex !== null,
            '!bg-green-100': props.selectedRows?.includes(row.id),
          }"
          @click="!sortable && $emit('rowClick', row)"
          @dragstart="onDragStart($event, index)"
          @dragover="onDragOver($event, index)"
          @dragleave="onDragLeave"
          @drop="onDrop($event, index)"
          @dragend="onDragEnd">
          <!-- Drag Handle Column -->
          <td v-if="sortable" class="w-10 px-2 py-2 text-center">
            <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </td>

          <td v-if="$slots.prepend">
            <slot name="prepend" :row="row" />
          </td>
          <td
            v-for="(col, key) of columns"
            :key="key"
            class="px-4 py-2"
            :class="`text-${col.align || 'left'}`">
            <span>{{ row[col.key] }}</span>
          </td>
          <td v-if="$slots.append">
            <slot name="append" :row="row" />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="p-2 text-gray-500" :colspan="footerColspan">No se encontraron resultados.</td>
        </tr>
      </tbody>
      <tfoot v-if="metadata && metadata.lastPage > 1">
        <tr>
          <td :colspan="footerColspan" class="p-2">
            <Paginator
              :modelValue="metadata.currentPage"
              :last-page="metadata.lastPage"
              @change="$emit('pageChange', $event)" />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
