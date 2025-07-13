<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '~/components/ProductCard.vue'
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

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

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
}

const prevPage = (showcase: Showcase) => {
  if (canGoPrev(showcase)) {
    carouselStates.value[showcase.id].currentPage--
  }
}

const goToPage = (showcase: Showcase, page: number) => {
  initializeCarousel(showcase.id)
  carouselStates.value[showcase.id].currentPage = page
}
</script>

<template>
  <div v-for="showcase in showcases" :key="showcase.id" class="mb-8">
    <header class="w-full text-center p-6">
      <div class="flex items-center justify-center gap-4">
        <div>
          <h1 class="text-2xl font-light uppercase">{{ showcase.name }}</h1>
          <p class="text-gray-600">{{ showcase.description }}</p>
        </div>
        <Icon v-if="isLoggedIn && isAdminContext" name="edit" size="lg" class="text-gray-600 cursor-pointer hover:text-primary" @click="router.visit(`/admin/showcases/${showcase.id}/edit`)"/>
      </div>


    </header>

    <div class="relative overflow-hidden rounded-md border">
      <!-- Previous Button -->
      <button
        v-if="canGoPrev(showcase)"
        @click="prevPage(showcase)"
        class="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 group"
      >
        <Icon name="chevronLeft" class="text-white group-hover:scale-110 transition-transform" size="lg" />
      </button>

      <!-- Carousel Container -->
      <div class="overflow-hidden">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${(carouselStates[showcase.id]?.currentPage || 0) * 100}%)` }"
        >
          <div
            v-for="(_, chunkIndex) in Math.ceil(showcase.products.length / itemsPerPage)"
            :key="chunkIndex"
            class="w-full flex-shrink-0 px-12"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <ProductCard
                v-for="product in showcase.products.slice(chunkIndex * itemsPerPage, (chunkIndex + 1) * itemsPerPage)"
                :key="product.id"
                :product="product"
                class="transform transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button
        v-if="canGoNext(showcase)"
        @click="nextPage(showcase)"
        class="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 group"
      >
        <Icon name="chevronRight" class="text-white group-hover:scale-110 transition-transform" size="lg" />
      </button>

      <!-- Page Indicators -->
      <div v-if="getTotalPages(showcase) > 1" class="flex justify-center space-x-2 py-4">
        <button
          v-for="page in getTotalPages(showcase)"
          :key="page"
          @click="goToPage(showcase, page - 1)"
          class="w-3 h-3 rounded-full transition-all duration-200"
          :class="[
            (carouselStates[showcase.id]?.currentPage || 0) === page - 1
              ? 'bg-primary scale-110'
              : 'bg-gray-300 hover:bg-gray-400'
          ]"
        />
      </div>

      <!-- Page Info -->
      <div v-if="getTotalPages(showcase) > 1" class="text-center text-sm text-gray-500 pb-2">
        {{ (carouselStates[showcase.id]?.currentPage || 0) + 1 }} de {{ getTotalPages(showcase) }}
      </div>
    </div>
  </div>
</template>
