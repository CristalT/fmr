<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import usePath from '~/composables/use_path'
import { Icon } from '~/components/ui'
import type Product from '#models/product'

const { staticPath, imagePath } = usePath()
const props = defineProps<{
  product: Product
  rounded?: boolean
  zoom?: boolean
}>()

const src = computed(() => imagePath(props.product.image))

const hasImage = ref<boolean>(true)
const isZooming = ref(false)
const origin = ref('50% 50%')

function loadPlaceholder() {
  hasImage.value = false
}

watch(src, () => {
  hasImage.value = true
})

function onMouseMove(event: MouseEvent) {
  if (!props.zoom) return

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  origin.value = `${x}% ${y}%`
}

function onMouseLeave() {
  isZooming.value = false
  origin.value = '50% 50%'
}
</script>

<template>
  <div
    :class="{ 'rounded-md': rounded }"
    class="relative mx-auto flex w-full items-center justify-center overflow-hidden"
    @mouseenter="zoom && (isZooming = true)"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave">
    <img
      class="max-h-full max-w-full object-cover transition-transform duration-200 ease-out motion-reduce:transition-none"
      :class="{ 'cursor-zoom-in': zoom, 'scale-[2.2]': zoom && isZooming }"
      :style="zoom ? { transformOrigin: origin } : undefined"
      :src
      :alt="product.name"
      @error="loadPlaceholder"
      v-show="hasImage" />
    <img
      class="max-h-full max-w-full object-cover"
      :src="staticPath('image-placeholder.webp')"
      :alt="product.name"
      v-show="!hasImage" />

    <div
      v-if="zoom && hasImage"
      class="pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 text-gray-600 shadow transition-opacity duration-200"
      :class="{ 'opacity-0': isZooming }">
      <Icon name="zoom" size="sm" />
    </div>
  </div>
</template>
