<script setup lang="ts">
import { Icon } from '~/components/ui'
import { useCategory } from '~/composables'
import type Category from '#models/category'

const { category } = defineProps<{ category: Category & { productsCount?: number } }>()

const emit = defineEmits<{
  (e: 'edit', category: Category): void
}>()

const { fetch } = useCategory(category.id)

const { data, isFetching } = fetch()

const isOpen = defineModel<boolean>({ default: false })
</script>

<template>
  <div class="flex cursor-pointer flex-col gap-2">
    <div>
      <div
        class="m-2 flex items-center justify-between gap-4 rounded-md p-4 hover:bg-gray-100"
        @click="isOpen = !isOpen">
        <div class="flex items-center gap-2">
          <Icon
            name="chevronRight"
            size="sm"
            :class="{ 'rotate-90': isOpen }"
            v-if="data?.length" />
          <span>
            {{ category.name }}
          </span>
          <span
            class="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
            v-if="category.productsCount">
            {{ category.productsCount }}
          </span>
        </div>

        <Icon
          name="edit"
          size="sm"
          class="hover:text-primary"
          @click.stop="emit('edit', category)" />
      </div>

      <Category
        v-if="!isFetching && isOpen"
        v-for="(category, index) of data"
        :style="`margin-left: ${25 * (index + 1)}px`"
        :category="category"
        :key="index"
        @edit="emit('edit', $event)" />
    </div>
  </div>
</template>
