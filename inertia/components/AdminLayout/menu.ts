import { router } from '@inertiajs/vue3'
import { Menu } from './menu_builder'

const menu = new Menu()

menu.addOption({
  label: 'Mensajes',
  action: () => router.visit('/admin/messages'),
  icon: 'message',
})

menu.addOption({
  label: 'Registros',
  action: () => router.visit('/admin/registries'),
  icon: 'registry',
})

menu.addOption({
  label: 'Clientes',
  action: () => router.visit('/admin/customers/view'),
  icon: 'clients',
})

menu.addOption({
  label: 'Pedidos',
  action: () => router.visit('/admin/orders'),
  icon: 'orders',
})

menu.addOption(
  {
    label: 'Stock',
    icon: 'stock',
  },
  (option) => {
    option.addSubOption({
      label: 'Productos',
      action: () => router.visit('/admin/stock/view'),
    })
    option.addSubOption({
      label: 'Categorías',
      action: () => router.visit('/admin/categories-list'),
    })
  }
)

menu.addOption({
  label: 'Proveedores',
  action: () => router.visit('/admin/providers/list'),
  icon: 'provider',
})

menu.addOption(
  {
    label: 'Tesorería',
    icon: 'treasury',
  },
  (option) => {
    option.addSubOption({
      label: 'Recibos',
      action: () => router.visit('/admin/receipts'),
    })
  }
)

menu.addOption({
  label: 'Vidrieras',
  action: () => router.visit('/admin/showcases/list'),
  icon: 'showcase',
})

menu.addOption({
  label: 'Configuración',
  action: () => router.visit('/admin/settings/view'),
  icon: 'settings',
})

export default menu
