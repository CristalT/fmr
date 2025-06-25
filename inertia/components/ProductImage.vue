<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import usePath from '~/composables/use_path'
import type Product from '#models/product'

const { staticPath, imagePath } = usePath()
const props = defineProps<{
  product: Product
  rounded?: boolean
}>()

const src = computed(() => imagePath(props.product.image))

const hasImage = ref<boolean>(true)

function loadPlaceholder() {
  hasImage.value = false
}

watch(src, () => {
  hasImage.value = true
})
</script>

<template>
  <div :class="{ 'rounded-md': rounded }" class="flex items-center justify-center overflow-hidden">
    <img class="object-cover max-h-full max-w-full" :src :alt="product.name" @error="loadPlaceholder" v-show="hasImage" />
    <img class="object-cover max-h-full max-w-full" :src="staticPath('image-placeholder.webp')" :alt="product.name"
      v-show="!hasImage" />
  </div>
</template>
