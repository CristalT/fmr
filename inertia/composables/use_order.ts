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

  const total = computed(() =>
    Math.round(order.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0))
  )

  const asked = computed(() => order.cartItems.reduce((acc, item) => acc + item.quantity, 0))
  const delivered = computed(() => order.cartItems.reduce((acc, item) => acc + item.delivered, 0))
  const pending = computed(() => asked.value - delivered.value)

  async function setStatus(status: OrderStatus) {
    const oldStatus = order.status
    return http(`admin/orders/${order.id}`)
      .patch({ status })
      .then(() => {
        order.status = status
      })
      .catch((error) => {
        order.status = oldStatus // Revert to old status on error
        toast.error('Error al cambiar el estado del pedido')
        console.error('Failed to update order status:', error)
      })
  }

  return { customerFullName, setStatus, total, asked, delivered, pending }
}
