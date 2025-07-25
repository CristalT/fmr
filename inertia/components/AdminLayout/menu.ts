import { router } from '@inertiajs/vue3'
import { Menu } from './menu_builder'

const menu = new Menu()

menu.addOption({
  label: 'Mensajes',
  action: () => router.visit('/admin/messages'),
  icon: 'message',
  section: 'messages',
})

menu.addOption({
  label: 'Registros',
  action: () => router.visit('/admin/registries'),
  icon: 'registry',
  section: 'registries',
})

menu.addOption({
  label: 'Clientes',
  action: () => router.visit('/admin/customers/view'),
  icon: 'clients',
  section: 'customers',
})

menu.addOption({
  label: 'Pedidos',
  action: () => router.visit('/admin/orders'),
  icon: 'orders',
  section: 'orders',
})

menu.addOption({
  label: 'Stock',
  action: () => router.visit('/admin/stock/view'),
  icon: 'stock',
  section: 'stock',
})

menu.addOption({
  label: 'Proveedores',
  action: () => router.visit('/admin/providers/list'),
  icon: 'provider',
  section: 'providers',
})

menu.addOption({
  label: 'Vidrieras',
  action: () => router.visit('/admin/showcases/list'),
  icon: 'showcase',
  section: 'showcases',
})

menu.addOption({
  label: 'Configuración',
  action: () => router.visit('/admin/settings/view'),
  icon: 'settings',
  section: 'settings',
})

export default menu
