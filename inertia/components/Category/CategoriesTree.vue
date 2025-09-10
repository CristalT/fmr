<script setup lang="ts">
import CategorySelect from './CategorySelect.vue'
import type Category from '#models/category'
import { Button } from '~/components/ui'
import { computed, onMounted, ref } from 'vue'
import { first, get } from 'lodash-es'
import { createReusableTemplate } from '@vueuse/core'

defineProps<{ label?: string }>()

const isEditing = ref(false)
const tree = ref<Category[]>([])
const categories = defineModel<Category[]>({ default: [] as Category[] })
const isUniq = computed(() => tree.value.length === 1)
const mainCategoryId = computed(() => get(first(tree.value), 'id'))

function addCategory(category: Category) {
  const idx = tree.value.findIndex((cat) => cat.id === category.id)
  if (idx > -1) return
  tree.value.push(category)
}

function updateModel() {
  categories.value = [...tree.value] as Category[]
  isEditing.value = false
}

function removeCategory(category: Category) {
  const idx = tree.value.findIndex((cat) => cat.id === category.id)
  if (idx > -1) {
    tree.value.splice(idx, 1)
  }
}

function isLast(category: Category) {
  return tree.value.indexOf(category) === tree.value.length - 2 || tree.value.length === 1
}

onMounted(() => {
  if (categories.value.length) {
    tree.value = [...categories.value]
  }
})
</script>

<template>
  <div class="flex flex-col gap-2" v-if="isEditing">
    <ul>
      <li class="relative m-2">
        <CategorySelect
          :model-value="mainCategoryId"
          :removable="isUniq"
          @select="addCategory"
          @remove="removeCategory" />
      </li>
      <li
        v-for="(category, index) of tree"
        :key="index"
        :style="`margin-left: ${30 * (index + 1)}px`"
        class="relative m-2">
        <CategorySelect
          :removable="isLast(category as Category)"
          :parent-id="category.id || null"
          :model-value="tree[index + 1]?.id ?? 0"
          @select="addCategory"
          @remove="removeCategory" />
      </li>
    </ul>
    <div class="flex justify-end p-2">
      <Button @click="updateModel" label="Aceptar" variant="secondary" flat />
    </div>
  </div>
  <div v-else class="p-2">
    <div class="tree-container">
      <ul class="tree-list" v-if="tree.length">
        <li
          v-for="(category, index) in tree"
          :key="category.id"
          :style="{ marginLeft: `${index * 34}px` }"
          class="tree-item">
          {{ category.name }}
        </li>
      </ul>
      <div v-else class="px-2 text-gray-500">Sin categorías asignadas</div>
    </div>
    <div class="mt-2 flex justify-end">
      <Button @click="isEditing = true" label="Editar" variant="secondary" flat />
    </div>
  </div>
</template>

<style scoped>
.tree-container {
  position: relative;
}

.tree-list {
  position: relative;
}

.tree-item {
  position: relative;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 3px;
  background-color: #f7f7f7;
}

.tree-line-vertical {
  position: absolute;
  left: -12px;
  top: 0;
  width: 2px;
  height: 50%;
  background: #ccc;
}

.tree-line-horizontal {
  position: absolute;
  left: -12px;
  top: 50%;
  width: 12px;
  height: 2px;
  background: #ccc;
  transform: translateY(-1px);
}
</style>
