<script setup lang="ts">
import { Button, Icon } from '~/components/ui'
import { computed } from 'vue'
import { PAGE_INTERVAL } from './page_interval'

const props = defineProps(['lastPage'])

const emit = defineEmits<{ (e: 'change', page: number): void }>()

const model = defineModel<number>({ required: true })

function handlePageChange(n: number) {
  if (n < 1 || n > props.lastPage) return
  model.value = n
  emit('change', n)
}

const pageNumbers = computed(() => {
  const prev = model.value - PAGE_INTERVAL
  const next = model.value + PAGE_INTERVAL

  const pages = []

  for (let i = prev; i <= next; i++) {
    if (i > 0 && i <= props.lastPage) {
      pages.push(i)
    }
  }

  // prepend first page
  if (model.value > 1 + PAGE_INTERVAL) {
    const prepend = [1, '...']
    pages.unshift(...prepend)
  }

  // append last page
  const last = [...pages].sort(() => -1)[0]
  if (props.lastPage > last) {
    const append = ['...', props.lastPage]
    pages.push(...append)
  }

  return pages
})
</script>
<template>
  <div class="flex justify-center gap-4">
    <Button id="paginator__prev-page" variant="tertiary" @click="handlePageChange(model - 1)">
      <template #icon>
        <Icon name="chevronLeft" />
      </template>
    </Button>
    <ul class="flex gap-2 items-center" :key="model">
      <li v-for="page of pageNumbers" :key="page">
        <Button :variant="model === page ? 'primary' : 'tertiary'" :label="page" v-if="page !== '...'"
          @click="handlePageChange(page)" />
        <span v-else class="text-gray-400">{{ page }}</span>
      </li>
    </ul>
    <Button id="paginator__next-page" variant="tertiary" @click="handlePageChange(model + 1)">
      <template #icon>
        <Icon name="chevronRight" />
      </template>
    </Button>
  </div>
</template>
