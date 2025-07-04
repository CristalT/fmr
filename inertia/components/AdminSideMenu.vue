<script setup lang="ts">
import { usePage, router } from '@inertiajs/vue3'
import { useLocalStorage } from '@vueuse/core'
import { Icon } from '~/components/ui'
import { icons } from '~/components/ui/icon/icons'
import { useConfirm } from '~/composables'


const page = usePage()
const { confirmation } = useConfirm()

const isCollapsed = useLocalStorage('isCollapsed', false)

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

type MenuOption = {
  label: string
  to: string | (() => any)
  icon?: keyof typeof icons
}
const options: MenuOption[] = [
  { label: 'Mensajes', to: '/admin/messages', icon: 'message' },
  { label: 'Registros', to: '/admin/registries', icon: 'registry' },
  { label: 'Clientes', to: '/admin/customers/view', icon: 'clients' },
  { label: 'Pedidos', to: '/admin/orders', icon: 'orders' },
  { label: 'Stock', to: '/admin/stock/view', icon: 'stock' },
  { label: 'Vidrieras', to: '/admin/showcases/list', icon: 'showcase' },
  { label: 'Configuración', to: '/admin/settings/view', icon: 'settings' },
  { label: 'Salir', to: logout, icon: 'power' },
]

function isActive(item: MenuOption) {
  const currentRoute = page.url
  const { to } = item

  if (typeof to === 'string' && currentRoute.includes(to)) {
    return 'bg-gray-800'
  }
}

async function logout() {
  const conf = await confirmation({
    title: 'Salir',
    message: '¿Desea cerrar sesión?',
    type: 'danger'
  })


  if (conf) {
    router.visit('/auth/logout')
  }
}
</script>

<template>
  <aside class="h-screen bg-slate-900 transition-all duration-300 relative flex flex-col"
    :class="{ 'min-w-[15rem]': !isCollapsed, 'min-w-[4rem]': isCollapsed }">

    <ul class="w-full">
      <li v-for="(item, key) of options" :key="key" :class="[isActive(item), { 'justify-center': isCollapsed }]"
        class="p-4 gap-4 cursor-pointer text-gray-300 font-bold hover:bg-gray-800 flex items-center transition-all"
        @click="typeof item.to === 'function' ? item.to() : router.visit(item.to)">
        <Icon v-if="item.icon" :name="item.icon" />
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </li>
    </ul>

    <button @click="toggleMenu"
      class="absolute -right-3 bottom-4 bg-slate-900 text-white p-1 rounded-full shadow-md hover:bg-slate-800 z-10 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'rotate-180': isCollapsed }" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>
