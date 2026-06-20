<script setup lang="ts">
import { useSetting } from '~/composables'

const { settings } = useSetting()
</script>
<template>
  <footer class="bg-primary p-6 text-white">
    <div
      class="m-auto flex flex-col gap-8 pb-6 sm:flex-row sm:justify-between sm:pb-0 sm:pr-24 lg:max-w-[1400px]">
      <div class="flex flex-col gap-1 text-sm">
        <p v-if="settings.companyName" class="mb-1 text-base font-semibold">
          {{ settings.companyName }}
        </p>
        <p v-if="settings.companyAddress">{{ settings.companyAddress }}</p>
        <p v-if="settings.companyZipCode && settings.companyCity">
          {{ settings.companyZipCode }} - {{ settings.companyCity }}
        </p>
        <p v-if="settings.companyProvince">{{ settings.companyProvince }}</p>
        <p v-if="settings.companyPhone">Teléfono: {{ settings.companyPhone }}</p>
        <p v-if="settings.companyEmail">Email: {{ settings.companyEmail }}</p>
      </div>

      <nav class="flex flex-col gap-1 text-sm sm:items-start">
        <span class="mb-1 text-base font-semibold">Accesos rápidos</span>
        <a href="/" class="transition-colors hover:text-tertiary">Inicio</a>
        <a href="/products" class="transition-colors hover:text-tertiary">Artículos</a>
        <a href="/contact" class="transition-colors hover:text-tertiary">Contacto</a>
      </nav>
    </div>
  </footer>
</template>
