<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '~/components/ui'
import type Product from '#models/product'
import ProductImage from '../ProductImage.vue'
import { usePath, useConfirm } from '~/composables'

const { staticPath } = usePath()
const { confirmation } = useConfirm()

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

const emit = defineEmits(['delete'])

const model = defineModel<File | null>()
const inputFile = ref()
const preview = ref<string>(props.product.image || '')

const imageSrc = computed(() => {
  return preview.value || staticPath('image-placeholder.webp')
})

const isDeletable = computed(() => preview.value || model.value)

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

async function deleteImage() {
  const conf = await confirmation({
    title: 'Borrar imagen',
    type: 'danger',
    message: '¿Desea eliminar la imagen?',
  })

  if (!conf) return

  preview.value = ''
  model.value = null
  emit('delete')
}

async function handlePaste(event: ClipboardEvent) {
  const items = Array.from(event.clipboardData?.items ?? [])
  const imageItem = items.find(
    (item) =>
      item.kind === 'file' &&
      item.type.startsWith('image/') &&
      (props.accept === '*' || props.accept.split(',').includes(item.type))
  )

  if (!imageItem) return

  const file = imageItem.getAsFile()
  if (!file) return

  if (isDeletable.value) {
    const conf = await confirmation({
      title: 'Reemplazar imagen',
      type: 'warning',
      message: '¿Desea reemplazar la imagen actual?',
    })
    if (!conf) return
  }

  const reader = new FileReader()
  model.value = file
  reader.onload = function (e) {
    preview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

onMounted(() => {
  if (props.src) preview.value = props.src
  window.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste)
})
</script>
<template>
  <div class="flex flex-col">
    <p v-if="label">{{ label }}</p>
    <div class="relative overflow-hidden rounded-md">
      <div
        class="absolute flex h-full w-full flex-col items-center justify-center gap-4 opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
        <div class="flex w-full justify-center gap-4">
          <Icon
            name="edit"
            class="cursor-pointer text-white transition-transform hover:scale-150"
            @click="changeImage" />
          <Icon
            v-if="isDeletable"
            ref="deleteAction"
            name="delete"
            class="cursor-pointer text-white transition-transform hover:scale-150"
            @click="deleteImage" />
        </div>
        <div class="text-white">Ctrl + V para pegar imagen</div>
      </div>
      <input :accept="accept" type="file" v-show="false" ref="inputFile" @change="loadImage" />
      <ProductImage v-if="!preview && !product.image" rounded :product class="mx-auto w-full" />
      <img
        id="img-preview"
        v-else
        :src="imageSrc"
        class="min-h-full max-w-full object-cover"
        alt="Product Image" />
    </div>
  </div>
</template>
