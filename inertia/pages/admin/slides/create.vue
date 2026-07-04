<script setup lang="ts">
import { Input, Button, Toggle, Icon, Alert, Card, Select } from '~/components/ui'
import { AdminLayout, SlideImageUpload } from '~/components'
import { computed } from 'vue'
import { useToast } from '~/composables'
import { router, useForm } from '@inertiajs/vue3'

const { toast } = useToast()

const form = useForm({
  title: '',
  tagline: '',
  ctaText: '',
  ctaHref: '',
  badge: '',
  theme: 'primary',
  public: 1,
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
  form.post('/admin/slides', {
    forceFormData: true,
    onError: () => toast.error('Error al crear el slide'),
  })
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <nav class="flex justify-between gap-2 items-center">
        <Button label="Volver" variant="tertiary" @click="router.visit('/admin/slides/list')">
          <template #icon>
            <Icon name="chevronLeft" />
          </template>
        </Button>
      </nav>
    </template>
    <form>
      <Alert variant="danger" v-if="form.errors?.backgroundImage">{{
        form.errors.backgroundImage
      }}</Alert>
      <Card>
        <template #header>
          <h2 class="text-lg font-medium text-gray-900">Nuevo slide</h2>
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
              v-model="form.backgroundImage"
              accept="image/png,image/jpg,image/jpeg,image/webp" />
            <SlideImageUpload
              label="Imagen de producto"
              v-model="form.productImage"
              accept="image/png,image/jpg,image/jpeg,image/webp" />
          </div>
        </div>
      </Card>
    </form>
    <template #footer>
      <div class="flex justify-end">
        <Button variant="primary" label="Aceptar" @click="save" />
      </div>
    </template>
  </AdminLayout>
</template>
