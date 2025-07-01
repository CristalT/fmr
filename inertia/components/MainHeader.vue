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

const isMobileMenuOpen = ref(false)

function isActive(route: string) {
  if (page.url === route) return ' border-b-2 !border-primary font-semibold text-primary'
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function navigateTo(route: string) {
  router.get(route)
  closeMobileMenu()
}
</script>

<template>
  <nav class="border-b bg-logo shadow-sm">
    <!-- Desktop Navigation -->
    <div class="flex justify-between items-center px-4 h-20">
      <img :src="staticPath('brand-logo.jpg')" class="h-12 sm:h-16" />

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center h-full">
        <ul class="flex h-full mr-4">
          <li v-for="item in options"
            class="px-4 lg:px-6 border-b-2 border-transparent hover:bg-gray-200 text-gray-700 cursor-pointer flex items-center transition-colors"
            :class="isActive(item.to)" @click="router.get(item.to)">
            {{ item.label }}
          </li>
        </ul>
        <a class="mx-4 lg:mx-12 border border-gray-500 text-gray-500 hover:bg-primary/20 py-1 px-4 rounded-full uppercase font-extralight text-sm transition-colors"
           href="/auth/customers/show"
           v-if="!customer.isLoggedIn.value">
          Ingresar
        </a>
        <CustomerAccountMenu />
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
        :class="{ 'space-y-0': isMobileMenuOpen }"
      >
        <span
          class="block w-6 h-0.5 bg-gray-700 transition-all duration-300"
          :class="{ 'rotate-45 translate-y-1.5': isMobileMenuOpen }"
        ></span>
        <span
          class="block w-6 h-0.5 bg-gray-700 transition-all duration-300"
          :class="{ 'opacity-0': isMobileMenuOpen }"
        ></span>
        <span
          class="block w-6 h-0.5 bg-gray-700 transition-all duration-300"
          :class="{ '-rotate-45 -translate-y-1.5': isMobileMenuOpen }"
        ></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      class="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
      :class="{ 'max-h-96 opacity-100': isMobileMenuOpen, 'max-h-0 opacity-0': !isMobileMenuOpen }"
    >
      <div class="px-4 py-2 bg-white border-t">
        <ul class="space-y-2">
          <li v-for="item in options" :key="item.to">
            <button
              @click="navigateTo(item.to)"
              class="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors"
              :class="{ 'bg-primary/10 text-primary font-semibold': page.url === item.to }"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <a
            v-if="!customer.isLoggedIn.value"
            class="block w-full text-center border border-gray-500 text-gray-500 hover:bg-primary/20 py-2 px-4 rounded-full uppercase font-extralight text-sm transition-colors"
            href="/auth/customers/show"
            @click="closeMobileMenu"
          >
            Ingresar
          </a>
          <div class="mt-2">
            <CustomerAccountMenu />
          </div>
        </div>
      </div>
    </div>
  </nav>
  <CustomerTools />
</template>
