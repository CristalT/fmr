<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ProductCard } from '~/components'
import { Icon } from '~/components/ui'
import { useShowcase, useAdmin } from '~/composables'
import { router, usePage } from '@inertiajs/vue3'
import type Showcase from '#models/showcase'

const { isLoggedIn } = useAdmin()

const { data } = useShowcase().fetchAll()

const page = usePage()

const showcases = computed(() => data.value || [])

// Carousel state for each showcase
const carouselStates = ref<Record<number, { currentPage: number }>>({})
const autoScrollIntervals = ref<Record<number, ReturnType<typeof setInterval>>>({})
const pausedShowcases = ref<Set<number>>(new Set())
const AUTO_SCROLL_INTERVAL = 4000

const itemsPerPage = ref(4)

function updateItemsPerPage() {
  const width = window.innerWidth
  if (width < 640) {
    itemsPerPage.value = 1
  } else if (width < 1024) {
    itemsPerPage.value = 2
  } else {
    itemsPerPage.value = 4
  }
}

const startAutoScroll = (showcase: Showcase) => {
  stopAutoScroll(showcase.id)
  if (getTotalPages(showcase) <= 1) return
  if (pausedShowcases.value.has(showcase.id)) return
  autoScrollIntervals.value[showcase.id] = setInterval(() => {
    initializeCarousel(showcase.id)
    const state = carouselStates.value[showcase.id]
    const total = getTotalPages(showcase)
    state.currentPage = (state.currentPage + 1) % total
  }, AUTO_SCROLL_INTERVAL)
}

const stopAutoScroll = (showcaseId: number) => {
  if (autoScrollIntervals.value[showcaseId]) {
    clearInterval(autoScrollIntervals.value[showcaseId])
    delete autoScrollIntervals.value[showcaseId]
  }
}

const toggleAutoScroll = (showcase: Showcase) => {
  if (pausedShowcases.value.has(showcase.id)) {
    pausedShowcases.value.delete(showcase.id)
    startAutoScroll(showcase)
  } else {
    pausedShowcases.value.add(showcase.id)
    stopAutoScroll(showcase.id)
  }
}

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
  Object.keys(autoScrollIntervals.value).forEach((id) => stopAutoScroll(Number(id)))
})

watch(
  showcases,
  (newShowcases) => {
    newShowcases.forEach((showcase) => startAutoScroll(showcase))
  },
  { immediate: true }
)

const isAdminContext = computed(() => page.url.includes('admin'))

const initializeCarousel = (showcaseId: number) => {
  if (!carouselStates.value[showcaseId]) {
    carouselStates.value[showcaseId] = { currentPage: 0 }
  }
}

const getTotalPages = (showcase: Showcase) => {
  return Math.ceil(showcase.products.length / itemsPerPage.value)
}

const canGoNext = (showcase: Showcase) => {
  initializeCarousel(showcase.id)
  const state = carouselStates.value[showcase.id]
  return state.currentPage < getTotalPages(showcase) - 1
}

const canGoPrev = (showcase: Showcase) => {
  initializeCarousel(showcase.id)
  const state = carouselStates.value[showcase.id]
  return state.currentPage > 0
}

const nextPage = (showcase: Showcase) => {
  if (canGoNext(showcase)) {
    carouselStates.value[showcase.id].currentPage++
  }
  pausedShowcases.value.add(showcase.id)
  stopAutoScroll(showcase.id)
}

const prevPage = (showcase: Showcase) => {
  if (canGoPrev(showcase)) {
    carouselStates.value[showcase.id].currentPage--
  }
  pausedShowcases.value.add(showcase.id)
  stopAutoScroll(showcase.id)
}

const goToPage = (showcase: Showcase, page: number) => {
  initializeCarousel(showcase.id)
  carouselStates.value[showcase.id].currentPage = page
  startAutoScroll(showcase)
}
</script>

<template>
  <div v-for="showcase in showcases" :key="showcase.id" class="mb-8">
    <header class="w-full p-2 text-center">
      <div class="flex items-center justify-center gap-2">
        <div>
          <h1 class="text-2xl font-light uppercase">{{ showcase.name }}</h1>
          <p class="text-gray-600">{{ showcase.description }}</p>
        </div>
        <Icon
          v-if="isLoggedIn && isAdminContext"
          name="edit"
          size="lg"
          class="cursor-pointer text-gray-600 hover:text-primary"
          @click="router.visit(`/admin/showcases/${showcase.id}/edit`)" />
      </div>
    </header>

    <div class="relative overflow-hidden">
      <!-- Previous Button -->
      <button
        v-if="canGoPrev(showcase)"
        @click="prevPage(showcase)"
        class="group absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition-all duration-200 hover:bg-black/70">
        <Icon
          name="chevronLeft"
          class="text-white transition-transform group-hover:scale-110"
          size="lg" />
      </button>

      <!-- Carousel Container -->
      <div class="overflow-hidden">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{
            transform: `translateX(-${(carouselStates[showcase.id]?.currentPage || 0) * 100}%)`,
          }">
          <div
            v-for="(_, chunkIndex) in Math.ceil(showcase.products.length / itemsPerPage)"
            :key="chunkIndex"
            class="w-full flex-shrink-0 px-12">
            <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <ProductCard
                v-for="product in showcase.products.slice(
                  chunkIndex * itemsPerPage,
                  (chunkIndex + 1) * itemsPerPage
                )"
                :key="product.id"
                :product="product"
                class="transform transition-all duration-300 hover:scale-105" />
            </div>
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button
        v-if="canGoNext(showcase)"
        @click="nextPage(showcase)"
        class="group absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition-all duration-200 hover:bg-black/70">
        <Icon
          name="chevronRight"
          class="text-white transition-transform group-hover:scale-110"
          size="lg" />
      </button>

      <!-- Page Indicators -->
      <div v-if="getTotalPages(showcase) > 1" class="flex items-center justify-center gap-3 py-4">
        <!-- Pause/Play Button -->
        <button
          @click="toggleAutoScroll(showcase)"
          class="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-primary"
          :title="pausedShowcases.has(showcase.id) ? 'Reanudar' : 'Pausar'">
          <!-- Play icon -->
          <svg
            v-if="pausedShowcases.has(showcase.id)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5">
            <path d="M8 5v14l11-7z" />
          </svg>
          <!-- Pause icon -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
        <div class="flex space-x-2">
          <button
            v-for="page in getTotalPages(showcase)"
            :key="page"
            @click="goToPage(showcase, page - 1)"
            class="h-3 w-3 rounded-full transition-all duration-200"
            :class="[
              (carouselStates[showcase.id]?.currentPage || 0) === page - 1
                ? 'scale-110 bg-primary'
                : 'bg-gray-300 hover:bg-gray-400',
            ]" />
        </div>
      </div>

      <!-- Page Info -->
      <div v-if="getTotalPages(showcase) > 1" class="pb-2 text-center text-sm text-gray-500">
        {{ (carouselStates[showcase.id]?.currentPage || 0) + 1 }} de {{ getTotalPages(showcase) }}
      </div>
    </div>
  </div>
</template>
