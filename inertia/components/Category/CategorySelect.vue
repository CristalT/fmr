<script setup lang="ts">
import { Select, Button, Card, Dialog, Input, Icon } from '~/components/ui'
import { computed, reactive, ref, watchEffect } from 'vue'
import { useCategory, useToast } from '~/composables'
import type { CreateCategory } from '~/composables/use_category'
import type Category from '#models/category'

const {
  parentId = null,
  label,
  removable = false,
} = defineProps<{ parentId?: number | null; label?: string; removable?: boolean }>()

const categoryId = defineModel<number>()

const { toast } = useToast()
const { create, fetch } = useCategory(parentId)

const { data, refetch, isFetching } = fetch()
const { mutateAsync } = create()

const emit = defineEmits<{
  (e: 'select', category: Category): void
  (e: 'remove', category: Category): void
}>()
const categoryOptions = computed(
  () =>
    data.value?.map((category) => ({
      value: category.id,
      label: category.name,
    })) ?? []
)

const createDialog = ref(false)

const newCategory = reactive<CreateCategory>({
  name: '',
  slug: '',
  description: '',
  parentId,
})

function onSelect(option: { value: string | number; label: string }) {
  const selectedCategory = data.value?.find((cat) => cat.id === option.value)
  if (selectedCategory) {
    emit('select', selectedCategory)
  }
}

function onRemove() {
  const selectedCategory = data.value?.find((cat) => cat.id === categoryId.value)
  if (selectedCategory) {
    emit('remove', selectedCategory)
  }
}
function createCategory() {
  if (!newCategory.name) return
  mutateAsync(newCategory)
    .then((createdCategory) => {
      refetch()

      createDialog.value = false
      newCategory.name = ''
      newCategory.slug = ''
      newCategory.description = ''

      emit('select', createdCategory)
    })
    .catch((error) => {
      toast.error('Error al crear la categoría.')
      console.error('Error creating category:', error)
    })
}

watchEffect(() => {
  newCategory.slug = newCategory.name.toLowerCase().replace(/\s+/g, '-')
})
</script>
<template>
  <Dialog v-model="createDialog">
    <form @submit.prevent="createCategory">
      <Card title="Nueva categoría" class="w-[400px]">
        <div class="flex h-[320px] flex-col gap-4">
          <Input
            autofocus
            type="text"
            v-model="newCategory.name"
            placeholder="Ingrese nombre de la categoría"
            label="Nombre" />
          <Input
            type="text"
            v-model="newCategory.slug"
            placeholder="Slug de la categoría"
            disabled
            label="Slug" />
          <Input
            type="textarea"
            label="Descripción"
            v-model="newCategory.description"
            placeholder="Ingrese breve descripción" />
        </div>
        <template #footer>
          <div class="flex items-center justify-end gap-2 pt-4">
            <Button variant="tertiary" label="Cancelar" @click="createDialog = false" />
            <Button type="submit" variant="primary" label="Aceptar" />
          </div>
        </template>
      </Card>
    </form>
  </Dialog>
  <div class="flex gap-2">
    <Select
      class="grow"
      v-if="!isFetching"
      :label
      :options="categoryOptions"
      v-model="categoryId"
      placeholder="Seleccione una categoría"
      @change="onSelect">
      <template #actions>
        <Button
          @click="createDialog = true"
          variant="primary"
          stretch
          flat
          label="Añadir categoría" />
      </template>
    </Select>

    <Button variant="danger" @click="onRemove" v-if="categoryId && removable" flat>
      <template #icon>
        <Icon name="delete" />
      </template>
    </Button>
  </div>
</template>
