<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, useTemplateRef } from 'vue'
import { useCustomer } from '~/composables'
import http from '~/shared/http'

const customer = useCustomer()
const isOpen = ref(false)

const menuRef = useTemplateRef<HTMLElement>('menuRef')

// Compute initials from customer's full name
const initials = computed(() => {
  if (!customer.fullName.value) return '?'

  return customer.fullName.value
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
})

// Generate a consistent color based on the user's ID
const avatarColor = computed(() => {
  if (!customer.userId.value) return 'bg-primary'

  // Simple hash function to generate a consistent color
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ]

  const colorIndex = customer.userId.value % colors.length
  return colors[colorIndex]
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function logout() {
  http('/auth/customers')
    .delete(customer.userId.value)
    .then(() => {
      window.location.replace('/')
    })
}

// Handle click outside to close the menu
function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div v-if="customer.isLoggedIn.value" class="relative mx-4" ref="menuRef">
    <!-- Trigger button with avatar circle -->
    <button
      @click.stop="toggleMenu"
      class="flex cursor-pointer items-center gap-2 hover:opacity-80"
      aria-haspopup="true"
      :aria-expanded="isOpen">
      <div
        :class="[
          avatarColor,
          'flex h-8 w-8 items-center justify-center rounded-full font-medium text-white',
        ]"
        title="Mi cuenta">
        {{ initials }}
      </div>
    </button>

    <!-- Dropdown menu -->
    <div v-if="isOpen" class="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
      <!-- User name at the top of the menu -->
      <div class="border-b border-gray-100 px-4 py-2 text-sm font-medium">
        {{ customer.fullName.value }}
      </div>
      <a href="/cart-items" class="block px-4 py-2 text-sm hover:bg-gray-100" @click="closeMenu">
        Mi Carrito
      </a>
      <a href="/orders" class="block px-4 py-2 text-sm hover:bg-gray-100" @click="closeMenu">
        Mis Pedidos
      </a>
      <div
        class="block cursor-pointer border-t border-gray-100 px-4 py-2 text-sm hover:bg-gray-100"
        @click="logout">
        Cerrar Sesión
      </div>
    </div>
  </div>
</template>
