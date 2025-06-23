<script setup lang="ts">
import { usePage, router } from '@inertiajs/vue3'

const page = usePage()

type MenuOption = {
  label: string
  to: string
}
const options: MenuOption[] = [
  { label: 'Mensajes', to: '/admin/messages' },
  { label: 'Registros', to: '/admin/registries' },
  { label: 'Clientes', to: '/admin/customers/view' },
  { label: 'Pedidos', to: '/admin/orders' },
  { label: 'Productos', to: '/admin/products' },
  { label: 'Salir', to: '/auth/logout' },
]

function isActive(item: MenuOption) {
  const currentRoute = page.url
  const { to } = item

  if (currentRoute.includes(to)) {
    return 'bg-gray-800'
  }
}
</script>

<template>
  <aside class="h-screen bg-gray-900">
    <ul class="min-w-[15rem]">
      <li v-for="(item, key) of options" :key :class="isActive(item)" class="p-4 cursor-pointer text-gray-300 font-bold hover:bg-gray-800"
        @click="router.visit(item.to)">
        {{ item.label }}
      </li>
    </ul>
  </aside>

</template>
