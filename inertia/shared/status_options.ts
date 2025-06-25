import Order from '#models/order'
import { OrderStatus } from '#types/order_status'

export const statusOptions: {
  label: string
  value: Order['status']
  component?: { name: string; props: Record<string, unknown> }
}[] = [
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
