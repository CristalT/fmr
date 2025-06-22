import Order from '#models/order'
import { OrderStatus } from '#types/order_status'

export const statusOptions: { label: string; value: Order['status'] }[] = [
  { label: 'Pendiente', value: OrderStatus.Pending },
  { label: 'En preparación', value: OrderStatus.Processing },
  { label: 'Enviado', value: OrderStatus.Shipped },
  { label: 'Entregado', value: OrderStatus.Delivered },
  { label: 'Cancelado', value: OrderStatus.Cancelled },
]
