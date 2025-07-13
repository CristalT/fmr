<script setup lang="ts">
import { Input, Button, Toggle, Icon, Alert, Card } from '~/components/ui'
import { AdminLayout, ImageUpload } from '~/components'
import { computed } from 'vue'
import { useToast } from '~/composables'
import { router, useForm } from '@inertiajs/vue3'
import type Product from '#models/product'
import ProviderSelect from '~/components/ProviderSelect.vue'

const { providers } = defineProps<{
  providers: { alias: string }[]
}>()

const providersOptions = computed(() => {
  return providers.map(provider => ({
    label: provider.alias,
    value: provider.alias,
  }))
})
const { toast } = useToast()

const form = useForm({
  id: '',
  code: '',
  provider: '',
  factoryCode: '',
  name: '',
  fob: '',
  price: '',
  stock: '',
  location: '',
  public: 1,
  image: null,
})

const product = computed(() => form.data() as unknown as Product)

const isPublic = computed({
  get: () => Boolean(form.public),
  set: (value) => {
    form.public = value ? 1 : 0
  },
})

function save() {
  form.post('/admin/stock', {
    forceFormData: true,
    onError: () => toast.error('Error al crear producto'),
  })
}
</script>

<template>
  <AdminLayout>
    <template #topbar>
      <nav class="flex justify-between gap-2 items-center">
        <Button label="Volver" variant="tertiary" @click="router.visit('/admin/stock/view')">
          <template #icon>
            <Icon name="chevronLeft" />
          </template>
        </Button>
      </nav>
    </template>
    <form>
      <Alert variant="danger" v-if="form.errors?.id">{{ form.errors.id }}</Alert>
      <Card>
        <template #header>
          <h2 class="text-lg font-medium text-gray-900">Nuevo producto</h2>
        </template>
        <div class="flex p-4 gap-4">
          <div class="basis-4/6 flex flex-col gap-2">
            <div class="flex gap-2">
              <Input
                class="basis-2/6"
                label="Código"
                v-model="form.code"
                :error="form.errors?.code"
              />
              <ProviderSelect
                class="basis-2/6"
                v-model="form.provider"
                :error="form.errors?.provider"
                label="Proveedor"
                :placeholder="'Seleccione un proveedor'"
                :options="providersOptions"
                
              />
              <Input
                class="basis-2/6"
                label="Catálogo"
                v-model="form.factoryCode"
                :error="form.errors?.factoryCode"
              />
            </div>
            <div class="w-full">
              <Input label="Descripción" v-model="form.name" :error="form.errors?.name" />
            </div>
            <div class="flex gap-2">
              <div class="w-full">
                <Input label="Costo" v-model="form.fob" :error="form.errors?.fob" />
              </div>
              <div class="w-full">
                <Input label="Precio" v-model="form.price" :error="form.errors?.price" />
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-full">
                <Input
                  label="Stock"
                  v-model="form.stock"
                  type="number"
                  :error="form.errors?.stock"
                />
              </div>
              <div class="w-full">
                <Input label="Ubicación" v-model="form.location" :error="form.errors?.location" />
              </div>
            </div>
            <div class="flex gap-4 items-center justify-between mt-4 border-t pt-4">
              <Toggle label="Público" v-model="isPublic" />
            </div>
          </div>
          <div class="basis-2/6 flex justify-center">
            <ImageUpload
              :product
              label="Imagen"
              v-model="form.image"
              accept="image/png,image/jpg,image/jpeg,image/webp"
            />
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
