<script lang="ts" setup>
import { AdminLayout } from '~/components';
import { Input, Card, Button } from '~/components/ui';
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue';
import ShowcaseProducts from '~/components/ShowcaseProducts.vue'

const showcase = useForm<{
  name: string
  description: string
  products: string[]
}>({
  name: '',
  description: '',
  products: []
})

const selected = ref<string[]>([]);

const save = () => {
  showcase.products = selected.value
  showcase.post('/admin/showcases')
}

</script>
<template>
  <AdminLayout>
    <Card>
      <div class="flex flex-col gap-2">
        <Input v-model="showcase.name" label="Nombre" placeholder="Ingrese un nombre para su vidriera" />
        <Input type="textarea" v-model="showcase.description" label="Descripción" placeholder="Ingrese una descripción para su vidriera" />
      </div>
    </Card>

    <ShowcaseProducts v-model="selected" />
    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button label="Guardar" @click="save" />
      </div>
    </template>
  </AdminLayout>
</template>
