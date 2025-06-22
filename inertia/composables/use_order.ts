import type Order from '#models/order'
import { OrderStatus } from '#types/order_status'
import { computed } from 'vue'
import { useToast } from '~/composables'
import http from '~/shared/http'

export default function useOrder(order: Order) {
  const { toast } = useToast()

  const customerFullName = computed(() => {
    return `${order.customerUser.firstName} ${order.customerUser.lastName}`
  })

  function setStatus(status: OrderStatus) {
    const oldStatus = order.status
    http
      .patch(`admin/orders/${order.id}`, {
        status,
      })
      .then(() => {
        order.status = status
      })
      .catch((error) => {
        order.status = oldStatus // Revert to old status on error
        toast.error('Error al cambiar el estado del pedido')
        console.error('Failed to update order status:', error)
      })
  }

  return { customerFullName, setStatus }
}
