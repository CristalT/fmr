<script setup lang="ts">
// Models
import type Setting from '#models/setting'

// Utilities
import { computed } from 'vue'

// Components
import { Input, Card } from '~/components/ui'
import AdminLayout from '~/components/AdminLayout.vue'
import SavingIndicator from '~/components/SavingIndicator.vue'

// Composables
import { useSetting } from '~/composables'

const { mutate, isPending, isSuccess, isError } = useSetting().update

const { settings } = defineProps<{ settings: Setting[] }>()

const companySettings = computed(() => settings.filter(s => s.key.startsWith('company_')))

</script>

<template>
  <AdminLayout>

    <Card>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Datos de la empresa</h2>
          <SavingIndicator :is-saving="isPending" :is-saved="isSuccess" :is-error="isError" />
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <div v-for="setting in companySettings" :key="setting.key">
          <Input
            v-model="setting.value"
            :label="setting.description ?? setting.key"
            :type="setting.type"
            :debounce="500"
            @update:model-value="mutate(setting)"
          />
        </div>
      </div>
    </Card>
  </AdminLayout>
</template>
