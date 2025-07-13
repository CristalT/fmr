<script setup lang="ts">
// Models
import type Setting from '#models/setting'


// Components
import { Input, Card } from '~/components/ui'
import { AdminLayout } from '~/components'
import SavingIndicator from '~/components/SavingIndicator.vue'

// Composables
import { useSetting } from '~/composables'

const { mutate, isPending, isSuccess, isError } = useSetting().update

const { settings } = defineProps<{ settings: Setting[] }>()

const companySettings = settings.filter(s => s.key.startsWith('company_')).map(castToType)

const stockSettings = settings.filter(s => s.key.startsWith('stock_')).map(castToType)

function castToType(setting: Setting): Setting {
  const { type, value } = setting

  const castedValue = () => {
    switch (type) {
      case 'string':
        return value
      case 'number':
        return Number(value)
      case 'boolean':
        return value === 'true'
      case 'json':
        try {
          return JSON.parse(value)
        } catch (error) {
          return value
        }
      case 'email':
        return value
      default:
        return value
    }
  }

  setting.value = castedValue()
  return setting;
}

</script>

<template>
  <AdminLayout>
    <div class="flex flex-col gap-4 pb-4">
      <Card collapsible default-collapsed>
        <template #header>
          <h2 class="text-2xl font-bold">Datos de la empresa</h2>
        </template>
        <div class="flex flex-col gap-4">
          <div v-for="setting in companySettings" :key="setting.key">
            <Input v-model="setting.value" :label="setting.description ?? setting.key" :type="setting.type"
              :debounce="500" @update:model-value="mutate(setting)" />
          </div>
        </div>
      </Card>

      <Card collapsible default-collapsed>
        <template #header>

          <h2 class="text-2xl font-bold">Stock</h2>

        </template>
        <div class="flex flex-col gap-4">
          <div v-for="setting in stockSettings" :key="setting.key">
            <Input v-model="setting.value" :label="setting.description ?? setting.key" :type="setting.type"
              :debounce="500" @update:model-value="mutate(setting)" />
          </div>
        </div>
      </Card>
    </div>
    <SavingIndicator float :is-saving="isPending" :is-saved="isSuccess" :is-error="isError" />


  </AdminLayout>
</template>
