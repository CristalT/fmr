<script setup lang="ts">
import { Icon } from '~/components/ui'
import { router, usePage } from '@inertiajs/vue3'
import { useCart, usePath } from '~/composables'
import { computed, ref } from 'vue'

const { staticPath } = usePath()

const cart = useCart()

const cartLength = computed(() => cart.items.value.length)

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

const isCustomerLoggedIn = computed(() => (page.props as unknown as { auth: { isCustomerLoggedIn: boolean } }).auth.isCustomerLoggedIn)

const userId = computed(() => (page.props as unknown as { auth: { userId: number } }).auth.userId)

function isActive(route: string) {
  if (page.url === route) return 'bg-primary text-white'
}
</script>

<template>
  <nav class="flex justify-between border-b items-center px-4 bg-logo shadow-sm h-20">
    <img :src="staticPath('brand-logo.jpg')" class="h-16" />
    <div class="flex items-center h-full">
      <ul class="flex h-full">
        <li v-for="item in options"
          class="px-6 hover:bg-primary hover:text-white cursor-pointer flex h-full items-center"
          :class="isActive(item.to)" @click="router.get(item.to)">
          {{ item.label }}
        </li>
      </ul>

      <div v-if="isCustomerLoggedIn" class="flex cursor-pointer p-6 hover:bg-primary hover:text-white h-full" :class="isActive('/carts')"
        @click="router.get('/carts')">

        <Icon name="cart" /> {{ cartLength }}

      </div>
      <a class="mx-12 underline hover:text-primary" href="/auth/customers/show"
        v-if="!isCustomerLoggedIn">Ingresar</a>
      <div class="mx-12 underline hover:text-primary cursor-pointer" @click="router.delete(`/auth/customers/${userId}`)" v-else>Salir</div>
    </div>
  </nav>
</template>
