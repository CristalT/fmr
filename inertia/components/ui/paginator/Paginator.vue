<script setup lang="ts">
import { Button, Icon } from '~/components/ui'
import { computed, ref } from 'vue'
import { PAGE_INTERVAL } from './page_interval'

const props = defineProps(['lastPage', 'currentPage'])

const emit = defineEmits<{ (e: 'change', page: number): void }>()


const page = ref(props.currentPage)

function handlePageChange(n: number) {
  if (n < 1 || n > props.lastPage) return
  page.value = n
  emit('change', n)
}

const pageNumbers = computed(() => {
  const prev = props.currentPage - PAGE_INTERVAL
  const next = props.currentPage + PAGE_INTERVAL

  const pages = []

  for (let i = prev; i <= next; i++) {
    if (i > 0 && i <= props.lastPage) {
      pages.push(i)
    }
  }

  // prepend first page
  if (props.currentPage > 1 + PAGE_INTERVAL) {
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
    <Button id="paginator__prev-page" variant="tertiary" @click="handlePageChange(currentPage - 1)">
      <template #icon>
        <Icon name="chevronLeft" />
      </template>
    </Button>
    <ul class="flex gap-2 items-center" :key="currentPage">
      <li v-for="page of pageNumbers" :key="page">
        <Button :variant="currentPage === page ? 'primary' : 'tertiary'" :label="page" v-if="page !== '...'"
          @click="handlePageChange(page)" />
        <span v-else class="text-gray-400">{{ page }}</span>
      </li>
    </ul>
    <Button id="paginator__next-page" variant="tertiary" @click="handlePageChange(currentPage + 1)">
      <template #icon>
        <Icon name="chevronRight" />
      </template>
    </Button>
  </div>
</template>
