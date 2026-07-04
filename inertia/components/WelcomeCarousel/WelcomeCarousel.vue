<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type SlideTheme = 'primary' | 'secondary'

interface SlideData {
  imageSrc: string
  imageAlt: string
  backgroundSrc: string
  title: string
  tagline: string
  ctaText: string
  ctaHref: string
  badge?: string
  theme?: SlideTheme
}

const props = defineProps<{
  slides: SlideData[]
}>()

const THEMES: Record<
  SlideTheme,
  { bg: string; text: string; border: string; ctaBg: string; ctaText: string }
> = {
  primary: {
    bg: 'bg-blue-700/80',
    text: 'text-white',
    border: 'border-white',
    ctaBg: 'bg-white',
    ctaText: 'text-primary',
  },
  secondary: {
    bg: 'bg-green-700/80',
    text: 'text-white',
    border: 'border-white',
    ctaBg: 'bg-white',
    ctaText: 'text-secondary',
  },
}

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
const touchStartX = ref(0)

function themeFor(slide: SlideData) {
  return THEMES[slide.theme ?? 'primary']
}

function advance() {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length
}

function goTo(index: number) {
  currentIndex.value = index
  restart()
}

function start() {
  if (props.slides.length <= 1) return
  timer = setInterval(advance, 5000)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function restart() {
  stop()
  start()
}

function onPrev() {
  prev()
  restart()
}

function onNext() {
  advance()
  restart()
}

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
}

function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    diff > 0 ? onNext() : onPrev()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') onPrev()
  else if (e.key === 'ArrowRight') onNext()
}

onMounted(() => {
  start()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  stop()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    class="relative h-full w-full overflow-hidden rounded-xl"
    role="region"
    aria-label="Presentación de productos"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 cursor-pointer transition-opacity duration-700 ease-in-out"
      :class="
        index === currentIndex
          ? 'pointer-events-auto z-10 opacity-100'
          : 'pointer-events-none z-0 opacity-0'
      "
      :aria-hidden="index !== currentIndex"
      @click="onNext">
      <!-- fondo -->
      <div
        :style="`background-image: url(${slide.backgroundSrc}); background-size:cover`"
        class="absolute left-0 top-0 z-0 h-full w-full" />
      <!-- content -->
      <div class="relative z-10 flex h-full w-full flex-col lg:flex-row">
        <div
          class="flex shrink-0 items-center justify-center overflow-hidden px-4 py-3 sm:px-6 lg:min-h-0 lg:flex-1 lg:py-0">
          <div class="flex w-full max-w-full flex-col gap-2 sm:max-w-lg lg:max-w-xl">
            <div
              class="flex flex-col gap-2 overflow-hidden rounded-3xl border p-4 sm:gap-3 sm:p-6"
              :class="[themeFor(slide).bg, themeFor(slide).border]">
              <h1
                class="font-modak truncate text-2xl leading-tight tracking-wide lg:text-4xl"
                :class="themeFor(slide).text">
                {{ slide.title }}
              </h1>
              <p
                class="font-vietnam line-clamp-2 text-base leading-snug lg:text-lg"
                :class="themeFor(slide).text">
                {{ slide.tagline }}
              </p>
              <a
                :href="slide.ctaHref"
                class="font-vietnam w-full cursor-pointer rounded-2xl py-2 text-center text-sm font-semibold sm:py-2.5 lg:text-base"
                :class="[themeFor(slide).ctaBg, themeFor(slide).ctaText]"
                @click.stop>
                {{ slide.ctaText }}
              </a>
            </div>
            <div
              v-if="slide.badge"
              class="max-w-full truncate rounded-3xl border px-4 py-1.5 text-xs font-semibold uppercase sm:px-5 sm:py-2 sm:text-sm"
              :class="[themeFor(slide).bg, themeFor(slide).text, themeFor(slide).border]">
              <p>{{ slide.badge }}</p>
            </div>
          </div>
        </div>
        <div
          class="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-6 py-2 sm:px-12">
          <img
            :src="slide.imageSrc"
            :alt="slide.imageAlt"
            class="max-h-full max-w-full object-contain" />
        </div>
      </div>
    </div>

    <!-- slide navigation: arrows + dots -->
    <div
      v-if="slides.length > 1"
      class="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
      <button
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-50/30 bg-black/20 text-gray-50/50 transition-all duration-200 hover:border-gray-50/60 hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-50"
        aria-label="Slide anterior"
        @click="onPrev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div role="tablist" aria-label="Navegación del carrusel" class="flex gap-3">
        <button
          v-for="(_, index) in slides"
          :key="index"
          role="tab"
          :aria-selected="index === currentIndex"
          :aria-label="`Slide ${index + 1}`"
          class="h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-300"
          :class="index === currentIndex ? 'bg-gray-50' : 'bg-gray-50/40'"
          @click="goTo(index)" />
      </div>
      <button
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-50/30 bg-black/20 text-gray-50/50 transition-all duration-200 hover:border-gray-50/60 hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-50"
        aria-label="Slide siguiente"
        @click="onNext">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>
