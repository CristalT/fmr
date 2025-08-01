<script lang="ts" setup>
import { Select } from '~/components/ui'
import { useCustomer } from '~/composables'

const model = defineModel<string | number>()
const { data: customerOptions } = useCustomer().fetchOptions()
</script>

<template>
  <Select v-if="customerOptions" searchable :options="customerOptions" v-model="model" clearable />
</template>
