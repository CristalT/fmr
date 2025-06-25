<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Icon } from '~/components/ui'
import type Product from '#models/product'
import ProductImage from './ProductImage.vue'
import { usePath } from '~/composables'

const { staticPath } = usePath()

const props = withDefaults(
  defineProps<{
    label?: string
    accept?: string
    src?: string
    product: Product
  }>(),
  {
    accept: '*',
  }
)

const model = defineModel<File | null>()
const inputFile = ref()
const preview = ref<string>(props.product.image || '')

const imageSrc = computed(() => {
  return preview.value || staticPath('image-placeholder.webp')
})

function changeImage() {
  inputFile.value.click()
}

function loadImage(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  const file = target.files[0]

  const reader = new FileReader()

  model.value = file

  reader.onload = function (e) {
    preview.value = e.target?.result as string
  }

  reader.readAsDataURL(file)
}

function deleteImage() {
  preview.value = ''
  model.value = null
}

onMounted(() => {
  if (props.src) preview.value = props.src
})
</script>
<template>
  <div class="flex flex-col">

    <p v-if="label">{{ label }}</p>
    <div class="rounded-md overflow-hidden relative">
      <div class="h-full w-full absolute opacity-0 hover:opacity-100 hover:bg-black/50 transition-all flex gap-4 items-center justify-center">
        <Icon name="edit" class="text-white cursor-pointer hover:scale-150 transition-transform" @click="changeImage"  />
        <Icon name="delete" class="text-white cursor-pointer hover:scale-150 transition-transform" @click="deleteImage" />
      </div>
      <input :accept="accept" type="file" v-show="false" ref="inputFile" @change="loadImage" />
      <ProductImage v-if="!preview && !product.image" rounded :product class="w-full mx-auto" />
      <img id="img-preview" v-else :src="imageSrc" class="object-cover min-h-full max-w-full" alt="Product Image" />
    </div>
  </div>
</template>
