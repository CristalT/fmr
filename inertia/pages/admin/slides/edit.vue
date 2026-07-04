<script lang="ts" setup>
import { Input, Button, Toggle, Icon, Alert, Card, Select } from '~/components/ui'
import { AdminLayout, SlideImageUpload } from '~/components'
import { computed } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { useConfirm, useToast, usePath } from '~/composables'
import type Slide from '#models/slide'

const props = defineProps<{ slide: Slide }>()

const { confirmation } = useConfirm()
const { toast } = useToast()
const { imagePath } = usePath()

const form = useForm({
  title: props.slide.title,
  tagline: props.slide.tagline,
  ctaText: props.slide.ctaText,
  ctaHref: props.slide.ctaHref,
  badge: props.slide.badge ?? '',
  theme: props.slide.theme,
  public: props.slide.public ? 1 : 0,
  backgroundImage: null as File | null,
  productImage: null as File | null,
})

const isPublic = computed({
  get: () => Boolean(form.public),
  set: (value) => {
    form.public = value ? 1 : 0
  },
})

const themeOptions = [
  { value: 'primary', label: 'Primario' },
  { value: 'secondary', label: 'Secundario' },
]

function save() {
  form.put(`/admin/slides/${props.slide.id}`, {
    forceFormData: true,
    onError: () => toast.error('Ocurrió un error al actualizar el slide'),
  })
}

async function deleteSlide() {
  const conf = await confirmation({
    title: 'Eliminar slide',
    message: `¿Desea eliminar el slide "${props.slide.title}"?`,
    type: 'danger',
    confirm: 'Eliminar',
    cancel: 'Cancelar',
  })
  if (!conf) return
  form.delete(`/admin/slides/${props.slide.id}`)
}
</script>

<template>
  <AdminLayout>
    <form>
      <Alert variant="danger" v-if="form.errors?.backgroundImage">{{
        form.errors.backgroundImage
      }}</Alert>
      <Card>
        <template #header>
          <h2 class="text-lg font-medium text-gray-900">Editar slide</h2>
        </template>
        <div class="flex p-4 gap-4">
          <div class="basis-4/6 flex flex-col gap-2">
            <Input label="Título" v-model="form.title" :error="form.errors?.title" />
            <Input label="Subtítulo" v-model="form.tagline" :error="form.errors?.tagline" />
            <div class="flex gap-2">
              <Input
                class="w-full"
                label="Texto del botón"
                v-model="form.ctaText"
                :error="form.errors?.ctaText" />
              <Input
                class="w-full"
                label="Link del botón"
                v-model="form.ctaHref"
                :error="form.errors?.ctaHref" />
            </div>
            <Input label="Badge (opcional)" v-model="form.badge" :error="form.errors?.badge" />
            <Select
              label="Tema"
              v-model="form.theme"
              :options="themeOptions"
              :error="form.errors?.theme" />
            <div class="flex gap-4 items-center justify-between mt-4 border-t pt-4">
              <Toggle label="Público" v-model="isPublic" />
            </div>
          </div>
          <div class="basis-2/6 flex flex-col gap-4">
            <SlideImageUpload
              label="Imagen de fondo (1080x720)"
              :src="imagePath(slide.backgroundImage ?? undefined)"
              v-model="form.backgroundImage"
              accept="image/png,image/jpg,image/jpeg,image/webp" />
            <SlideImageUpload
              label="Imagen de producto"
              :src="imagePath(slide.productImage ?? undefined)"
              v-model="form.productImage"
              accept="image/png,image/jpg,image/jpeg,image/webp" />
          </div>
        </div>
      </Card>
    </form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Eliminar" @click="deleteSlide" variant="danger" flat>
          <template #icon>
            <Icon name="delete" />
          </template>
        </Button>
        <Button label="Guardar" @click="save" />
      </div>
    </template>
  </AdminLayout>
</template>
