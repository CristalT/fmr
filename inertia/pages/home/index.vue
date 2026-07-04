<script lang="ts" setup>
import { computed } from 'vue'
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import Showcases from '~/components/Showcases.vue'
import WelcomeCarousel from '~/components/WelcomeCarousel/WelcomeCarousel.vue'
import { usePath } from '~/composables'
import type Slide from '#models/slide'

const props = defineProps<{ slides: Slide[] }>()

const { imagePath } = usePath()

const slideData = computed(() =>
  props.slides.map((slide) => ({
    imageSrc: imagePath(slide.productImage ?? undefined),
    imageAlt: slide.title,
    backgroundSrc: imagePath(slide.backgroundImage ?? undefined),
    title: slide.title,
    tagline: slide.tagline,
    ctaText: slide.ctaText,
    ctaHref: slide.ctaHref,
    badge: slide.badge ?? undefined,
    theme: slide.theme,
  }))
)
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div v-if="slideData.length" class="h-[calc(100dvh-7rem)] lg:mb-4 lg:h-[500px]">
      <WelcomeCarousel :slides="slideData" />
    </div>
    <Showcases />
  </MainLayout>
</template>
