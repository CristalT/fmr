<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
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

const model = defineModel<File>()
const inputFile = ref()
const preview = ref<string>('')

const imageSrc = computed(() => {
  return preview.value || props.product.image || ''
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

onMounted(() => {
  if (props.src) preview.value = props.src
})
</script>
<template>
  <p v-if="label">{{ label }}</p>
  <div class="rounded-md overflow-hidden cursor-pointer" @click="changeImage">
    <input :accept="accept" type="file" v-show="false" ref="inputFile" @change="loadImage" />
    <img :src="imageSrc" class="object-cover min-h-full max-w-full" alt="Product Image" />
  </div>
</template>
