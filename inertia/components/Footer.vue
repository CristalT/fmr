<script setup lang="ts">
import { useSetting } from '~/composables'

const { settings } = useSetting()
</script>
<template>
  <footer class="bg-primary p-6 text-white">
    <div>
      <p v-if="settings.companyName">{{ settings.companyName }}</p>
      <p v-if="settings.companyAddress">{{ settings.companyAddress }}</p>
      <p v-if="settings.companyZipCode && settings.companyCity">{{ settings.companyZipCode }} - {{ settings.companyCity }}</p>
      <p v-if="settings.companyProvince">{{ settings.companyProvince }}</p>
      <p v-if="settings.companyPhone">Teléfono: {{ settings.companyPhone }}</p>
      <p v-if="settings.companyEmail">Email: {{ settings.companyEmail }}</p>
    </div>
  </footer>
</template>
