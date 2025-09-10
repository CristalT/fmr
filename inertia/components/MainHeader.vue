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
    <div class="flex h-20 items-center justify-between px-4">
      <img :src="staticPath('brand-logo.jpg')" class="h-12 sm:h-16" />

      <!-- Desktop Menu -->
      <div class="hidden h-full items-center md:flex">
        <ul class="mr-4 flex h-full">
          <li
            v-for="item in options"
            class="flex cursor-pointer items-center border-b-2 border-transparent px-4 transition-colors hover:bg-gray-200 lg:px-6"
            :class="isActive(item.to)"
            @click="router.get(item.to)">
            {{ item.label }}
          </li>
        </ul>
        <a
          class="mx-2 rounded border border-primary px-4 py-1 text-sm font-light uppercase text-primary transition-colors hover:bg-primary/80 hover:text-white"
          href="/auth/customers/show"
          v-if="!customer.isLoggedIn.value">
          Ingresar
        </a>
        <a
          class="mx-2 rounded border border-secondary bg-secondary px-2 py-1 text-sm font-extralight uppercase text-white transition-colors hover:bg-secondary/80"
          href="/registries/create"
          v-if="!customer.isLoggedIn.value">
          Quiero ser cliente
        </a>
        <CustomerAccountMenu />
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMobileMenu"
        class="flex h-8 w-8 flex-col items-center justify-center space-y-1 md:hidden"
        :class="{ 'space-y-0': isMobileMenuOpen }">
        <span
          class="block h-0.5 w-6 bg-gray-700 transition-all duration-300"
          :class="{ 'translate-y-1.5 rotate-45': isMobileMenuOpen }"></span>
        <span
          class="block h-0.5 w-6 bg-gray-700 transition-all duration-300"
          :class="{ 'opacity-0': isMobileMenuOpen }"></span>
        <span
          class="block h-0.5 w-6 bg-gray-700 transition-all duration-300"
          :class="{ '-translate-y-1.5 -rotate-45': isMobileMenuOpen }"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      class="overflow-hidden transition-all duration-300 ease-in-out md:hidden"
      :class="{
        'max-h-96 opacity-100': isMobileMenuOpen,
        'max-h-0 opacity-0': !isMobileMenuOpen,
      }">
      <div class="border-t bg-white px-4 py-2">
        <ul class="space-y-2">
          <li v-for="item in options" :key="item.to">
            <button
              @click="navigateTo(item.to)"
              class="w-full rounded px-4 py-3 text-left transition-colors hover:bg-gray-100"
              :class="{
                'bg-primary/10 font-semibold text-primary': page.url === item.to,
              }">
              {{ item.label }}
            </button>
          </li>
        </ul>

        <div class="mt-4 border-t border-gray-200 pt-4">
          <a
            v-if="!customer.isLoggedIn.value"
            class="block w-full rounded-full border border-gray-500 px-4 py-2 text-center text-sm font-extralight uppercase text-gray-500 transition-colors hover:bg-primary/20"
            href="/auth/customers/show"
            @click="closeMobileMenu">
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
