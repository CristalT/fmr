<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Select } from '~/components/ui'

const model = defineModel<string>()

const providers = ref<{ value: string | number, label: string }[]>([])

async function getProviders() {
  const options = [{ value: '', label: 'Todos' }]

  const providerOptions = await fetch('/admin/providers')
    .then((response) => response.json())
    .then((data) => data.map(({ alias }: { alias: string }) => ({ value: alias, label: alias })))

  providers.value = options.concat(providerOptions)
}

onMounted(() => {
  getProviders()
})

</script>
<template>
  <Select v-if="providers.length" searchable :options="providers" v-model="model" />
</template>
