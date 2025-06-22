<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import ProductImage from './ProductImage.vue'
import Product from '#models/product';

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

const model = defineModel()

const inputFile = ref()
const preview = ref('')

function changeImage() {
  inputFile.value.click()
}

function loadImage(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  const file = target.files[0]

  const reader = new FileReader()

  reader.onload = function (e) {
    preview.value = e.target?.result as string
    model.value = file
  }

  reader.readAsDataURL(file)
}

onMounted(() => {
  if (props.src) preview.value = props.src
})
</script>
<template>
  <p v-if="label">{{ label }}</p>
  <div class="rounded-md overflow-hidden cursor-pointer" @click="changeImage">
    <input :accept="accept" type="file" v-show="false" ref="inputFile" @change="loadImage" />
    <ProductImage :product :src="preview" class="h-[200px] max-w-[300px]" />
  </div>
</template>
