<script lang="ts" setup>
import { Dialog, Input, Button, Card } from '~/components/ui'
import { ProductImage } from '~/components'
import type Product from '#models/product'

const { product } = defineProps<{
  product: Product
  title?: string
}>()

const visible = defineModel('visible', { required: true, type: Boolean, default: false })
const qty = defineModel('qty', { type: Number, default: 1 })
const emit = defineEmits<{ (event: 'update', payload: { product: Product; qty: number }): void }>()
</script>
<template>
  <Dialog v-model="visible">
    <form @submit.prevent="emit('update', { product, qty })">
      <Card :title>
        <div class="box-border pb-20">
          <div class="relative flex h-[200px] items-center gap-4">
            <ProductImage :product class="h-full" rounded />
            <div class="flex h-full flex-col items-center justify-center gap-4">
              <div class="flex w-[300px] flex-col gap-4">
                <div class="font-semibold text-gray-600">{{ product.code }}</div>
                <div class="text-sm">{{ product.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex items-end justify-between gap-2 pt-2">
            <Input class="w-24" autofocus type="number" placeholder="Cantidad" v-model="qty" />
            <div class="flex gap-2">
              <Button variant="tertiary" label="Cancelar" @click="visible = false" />
              <Button type="submit" variant="primary" label="Aceptar" />
            </div>
          </div>
        </template>
      </Card>
    </form>
  </Dialog>
</template>
