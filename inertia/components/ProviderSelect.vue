<script lang="ts" setup>
import { Select } from '~/components/ui'
import { useProvider } from '~/composables'

const model = defineModel<string>()

const { data: providers } = useProvider().fetchOptions()

</script>
<template>
  <Select v-if="providers" searchable :options="providers" v-model="model" clearable />
</template>
