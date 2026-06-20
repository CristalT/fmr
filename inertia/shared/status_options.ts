import { OrderStatus } from '#types/order_status'
import type { SelectOption } from '~/components/ui/select/Select.vue'

export const statusOptions: SelectOption[] = [
  {
    label: 'Pendiente',
    value: OrderStatus.Pending,
    component: { name: 'StatusBadge', props: { status: OrderStatus.Pending } },
  },
  {
    label: 'En preparación',
    value: OrderStatus.Processing,
    component: { name: 'StatusBadge', props: { status: OrderStatus.Processing } },
  },
  {
    label: 'Finalizado',
    value: OrderStatus.Completed,
    component: { name: 'StatusBadge', props: { status: OrderStatus.Completed } },
  },
  {
    label: 'Entregado',
    value: OrderStatus.Delivered,
    component: { name: 'StatusBadge', props: { status: OrderStatus.Delivered } },
  },
  {
    label: 'Cancelado',
    value: OrderStatus.Cancelled,
    component: { name: 'StatusBadge', props: { status: OrderStatus.Cancelled } },
  },
]
