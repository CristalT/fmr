<script setup lang="ts">
import CustomerTools from '~/components/CustomerTools.vue'
import { router, usePage } from '@inertiajs/vue3'
import { usePath, useCustomer } from '~/composables'
import { ref } from 'vue'
import CustomerAccountMenu from './CustomerAccountMenu.vue'

const { staticPath } = usePath()

const customer = useCustomer()

type Option = {
  icon?: string
  label: string
  to: string
}

const page = usePage()

const options = ref<Option[]>([
  { label: 'Inicio', to: '/' },
  { label: 'Artículos', to: '/products' },
  { label: 'Contacto', to: '/contact' },
])


function isActive(route: string) {
  if (page.url === route) return ' border-b-2 !border-primary font-semibold text-primary'
}
</script>

<template>
  <nav class="flex justify-between border-b items-center px-4 bg-logo shadow-sm h-20">
    <img :src="staticPath('brand-logo.jpg')" class="h-16" />
    <div class="flex items-center h-full">
      <ul class="flex h-full mr-4">
        <li v-for="item in options"
          class="px-6 border-b-2 border-transparent hover:bg-gray-200 text-gray-700 cursor-pointer flex items-center"
          :class="isActive(item.to)" @click="router.get(item.to)">
          {{ item.label }}
        </li>
      </ul>
      <a class="mx-12 underline hover:text-primary" href="/auth/customers/show"
        v-if="!customer.isLoggedIn.value">Ingresar</a>

        <CustomerAccountMenu />
    </div>
  </nav>
  <CustomerTools />
</template>
